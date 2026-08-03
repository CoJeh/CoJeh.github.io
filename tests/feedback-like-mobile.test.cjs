const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const widgetSource = fs.readFileSync(
  path.join(__dirname, "..", "feedback-widget.js"),
  "utf8"
);
const approvedCommentsSource = fs.readFileSync(
  path.join(__dirname, "..", "approved-comments-data.js"),
  "utf8"
);

function sourceBetween(start, end) {
  const startIndex = widgetSource.indexOf(start);
  const endIndex = widgetSource.indexOf(end, startIndex);
  assert.notEqual(startIndex, -1, `Missing ${start}`);
  assert.notEqual(endIndex, -1, `Missing ${end}`);
  return widgetSource.slice(startIndex, endIndex);
}

function createButton() {
  const countNode = { textContent: "0" };
  const attributes = new Map();
  return {
    dataset: {},
    disabled: false,
    title: "",
    type: "",
    addEventListener() {},
    getAttribute(name) {
      return attributes.get(name) || null;
    },
    querySelector(selector) {
      return selector === ".feedback-like-count" ? countNode : null;
    },
    setAttribute(name, value) {
      attributes.set(name, String(value));
    },
    set innerHTML(value) {
      const match = value.match(
        /class="feedback-like-count"[^>]*>(\d+)<\/span>/
      );
      countNode.textContent = match ? match[1] : "";
    },
    get countText() {
      return countNode.textContent;
    },
  };
}

function createHarness({
  failuresBeforeSuccess = 0,
  responseItems,
  cachedCounts,
  storageUnavailable = true,
} = {}) {
  let fetchCalls = 0;
  const storageValues = new Map();
  if (cachedCounts) {
    storageValues.set(
      "corrine-feedback-like-counts-v1",
      JSON.stringify(cachedCounts)
    );
  }
  const storage = storageUnavailable
    ? {
        getItem() {
          throw new Error("Storage unavailable");
        },
        setItem() {
          throw new Error("Storage unavailable");
        },
      }
    : {
        getItem(key) {
          return storageValues.get(key) || null;
        },
        setItem(key, value) {
          storageValues.set(key, String(value));
        },
      };
  const items = responseItems || {
    "xinjie-2026-07-24": { count: 3, liked: false },
  };
  const context = vm.createContext({
    INTERACTIONS_API: "https://likes.example.test",
    console: { ...console, warn() {} },
    crypto: { randomUUID: () => "test-voter" },
    AbortController,
    setTimeout(callback) {
      callback();
      return 1;
    },
    clearTimeout() {},
    localStorage: storage,
    sessionStorage: storage,
    t: {
      likeComment: "Like",
      unlikeComment: "Unlike",
      likesUnavailable: "Likes unavailable",
    },
    createElement() {
      return createButton();
    },
    fetch: async () => {
      fetchCalls += 1;
      if (fetchCalls <= failuresBeforeSuccess) {
        throw new Error("Mobile network temporarily unavailable");
      }
      return {
        ok: true,
        async json() {
          return { items };
        },
      };
    },
  });

  vm.runInContext(
    [
      sourceBetween(
        "const LIKE_LOOKUP_RETRY_DELAYS_MS",
        "async function hydrateLike"
      ),
      sourceBetween("async function hydrateLike", "function buildLikeButton"),
      sourceBetween("function buildLikeButton", "function renderBoard"),
    ].join("\n"),
    context
  );

  return {
    context,
    fetchCalls: () => fetchCalls,
    storedValue: (key) => storageValues.get(key),
  };
}

test("loads the public like count when mobile storage is unavailable", async () => {
  const harness = createHarness();
  const button = createButton();
  button.disabled = true;

  await harness.context.hydrateLike(button, "xinjie-2026-07-24");

  assert.equal(harness.fetchCalls(), 1);
  assert.equal(button.countText, "3");
  assert.equal(button.disabled, false);
});

test("shows the verified count while live hydration is pending", () => {
  const harness = createHarness();

  const button = harness.context.buildLikeButton("xinjie-2026-07-24", 3);

  assert.equal(button.countText, "3");
});

test("retries and loads Kevin's shared count after a transient mobile failure", async () => {
  const harness = createHarness({
    failuresBeforeSuccess: 2,
    responseItems: {
      "kevin-2026-08-01": { count: 2, liked: false },
    },
  });
  const button = createButton();
  button.dataset.count = "0";

  await harness.context.hydrateLike(button, "kevin-2026-08-01");

  assert.equal(harness.fetchCalls(), 3);
  assert.equal(button.countText, "2");
  assert.equal(button.disabled, false);
});

test("keeps the published cached count after all sync attempts fail", async () => {
  const harness = createHarness({ failuresBeforeSuccess: 3 });
  const button = createButton();
  button.dataset.count = "2";
  button.innerHTML = '<span class="feedback-like-count">2</span>';

  await harness.context.hydrateLike(button, "kevin-2026-08-01");

  assert.equal(harness.fetchCalls(), 3);
  assert.equal(button.countText, "2");
  assert.equal(button.disabled, false);
});

test("uses the latest published counts as the cross-device fallback", () => {
  const context = vm.createContext({ window: {} });
  vm.runInContext(approvedCommentsSource, context);

  assert.deepEqual(
    Object.fromEntries(
      context.window.APPROVED_COMMENTS.map((comment) => [
        comment.id,
        comment.likeCount,
      ])
    ),
    {
      "kevin-2026-08-01": 2,
      "xinjie-2026-07-24": 3,
    }
  );
});

test("restores the browser's last verified count before live sync", () => {
  const harness = createHarness({
    cachedCounts: { "kevin-2026-08-01": 5 },
    failuresBeforeSuccess: 3,
    storageUnavailable: false,
  });

  const button = harness.context.buildLikeButton("kevin-2026-08-01", 2);

  assert.equal(button.countText, "5");
});

test("stores a successful live count for the next failed visit", async () => {
  const harness = createHarness({
    responseItems: {
      "kevin-2026-08-01": { count: 4, liked: false },
    },
    storageUnavailable: false,
  });
  const button = createButton();
  button.dataset.count = "2";

  await harness.context.hydrateLike(button, "kevin-2026-08-01");

  const cached = JSON.parse(
    harness.storedValue("corrine-feedback-like-counts-v1")
  );
  assert.equal(cached["kevin-2026-08-01"], 4);
});

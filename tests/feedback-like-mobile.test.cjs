const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const widgetSource = fs.readFileSync(
  path.join(__dirname, "..", "feedback-widget.js"),
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

function createHarness() {
  let fetchCalls = 0;
  const context = vm.createContext({
    INTERACTIONS_API: "https://likes.example.test",
    console,
    crypto: { randomUUID: () => "test-voter" },
    localStorage: {
      getItem() {
        throw new Error("Storage unavailable");
      },
    },
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
      return {
        ok: true,
        async json() {
          return {
            items: {
              "xinjie-2026-07-24": { count: 3, liked: false },
            },
          };
        },
      };
    },
  });

  vm.runInContext(
    [
      sourceBetween("let volatileVoterToken", "async function hydrateLike"),
      sourceBetween("async function hydrateLike", "function buildLikeButton"),
      sourceBetween("function buildLikeButton", "function renderBoard"),
    ].join("\n"),
    context
  );

  return {
    context,
    fetchCalls: () => fetchCalls,
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

(function () {
  "use strict";

  const CLARITY_PROJECT_ID = "xsginfmfo5";
  const CONSENT_KEY = "corrine_portfolio_analytics_consent_v3";
  const CONSENT_GRANTED = "granted";
  const CONSENT_DENIED = "denied";
  const isChinese = (document.documentElement.lang || "").toLowerCase().startsWith("zh");
  const isGamePage = /\/play\/(?:index\.html)?$/i.test(window.location.pathname);

  const copy = isChinese
    ? {
        title: "匿名访问分析",
        body: "我们使用 Microsoft Clarity 统计匿名访问、点击和滚动，不收集表单内容。",
        accept: "同意",
        decline: "拒绝",
        privacy: "了解详情",
      }
    : {
        title: "Anonymous visit analytics",
        body: "Microsoft Clarity measures anonymous visits, clicks and scrolling. Form content is not collected.",
        accept: "Accept",
        decline: "Decline",
        privacy: "Learn more",
      };

  window.clarity =
    window.clarity ||
    function () {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };

  function storedConsent() {
    try {
      return window.localStorage.getItem(CONSENT_KEY);
    } catch (_error) {
      return null;
    }
  }

  function saveConsent(value) {
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
    } catch (_error) {
      // The consent signal still applies to the current page when storage is unavailable.
    }
  }

  function sendConsent(value) {
    window.clarity("consentv2", {
      ad_Storage: CONSENT_DENIED,
      analytics_Storage: value === CONSENT_GRANTED ? CONSENT_GRANTED : CONSENT_DENIED,
    });
  }

  function loadClarity() {
    if (!/^[a-z0-9]+$/i.test(CLARITY_PROJECT_ID)) return;
    if (document.querySelector(`script[src*="clarity.ms/tag/${CLARITY_PROJECT_ID}"]`)) return;
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`;
    script.dataset.portfolioAnalytics = "clarity";
    document.head.appendChild(script);
  }

  function sanitizeTag(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 80);
  }

  function tagPageAndCampaign() {
    const path = window.location.pathname.toLowerCase();
    const pageGroup = path.includes("/play/")
      ? "game"
      : path.includes("playbook")
        ? "playbook"
        : path.includes("dashboard")
          ? "dashboard"
          : "portfolio_home";

    window.clarity("set", "page_group", pageGroup);
    window.clarity("set", "page_locale", isChinese ? "zh" : "en");

    const params = new URLSearchParams(window.location.search);
    ["utm_source", "utm_medium", "utm_campaign"].forEach((key) => {
      const value = sanitizeTag(params.get(key));
      if (value) window.clarity("set", key, value);
    });
  }

  function eventNameForLink(anchor) {
    const href = (anchor.getAttribute("href") || "").toLowerCase();
    if (!href || href.startsWith("#")) return "";
    if (href.includes("dashboard") && href.endsWith(".html")) return "open_dashboard";
    if (href.includes("playbook") && href.endsWith(".html")) return "open_playbook";
    if (href.includes("play/index.html")) return "play_game";
    if (href.startsWith("mailto:")) return "click_email";
    if (href.includes("linkedin.com")) return "click_linkedin";
    return "";
  }

  function trackKeyActions() {
    document.addEventListener(
      "click",
      (event) => {
        const anchor = event.target.closest?.("a[href]");
        if (!anchor) return;
        const eventName = eventNameForLink(anchor);
        if (eventName) window.clarity("event", eventName);
      },
      { capture: true },
    );

    document.addEventListener("portfolio:feedback-submitted", () => {
      window.clarity("event", "submit_comment");
    });

    if (isGamePage) {
      const registerGameStart = () => {
        const canvas = document.getElementById("GameCanvas");
        if (!canvas) return;
        canvas.addEventListener(
          "pointerdown",
          () => window.clarity("event", "game_start"),
          { once: true, passive: true },
        );
      };
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", registerGameStart, { once: true });
      } else {
        registerGameStart();
      }
    }
  }

  function privacyHref() {
    const anchor = isChinese ? "#zh" : "#en";
    return isGamePage ? `../privacy.html${anchor}` : `privacy.html${anchor}`;
  }

  function injectStyles() {
    if (document.getElementById("portfolio-analytics-styles")) return;
    const style = document.createElement("style");
    style.id = "portfolio-analytics-styles";
    style.textContent = `
      .portfolio-consent {
        position: fixed;
        z-index: 2147483646;
        left: max(12px, env(safe-area-inset-left));
        right: max(12px, env(safe-area-inset-right));
        bottom: max(12px, env(safe-area-inset-bottom));
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: center;
        gap: 14px;
        max-width: 920px;
        margin: 0 auto;
        padding: 11px 12px 11px 15px;
        border: 1px solid rgba(231,227,218,.94);
        border-radius: 14px;
        background: rgba(253,252,250,.98);
        color: #1c1b18;
        box-shadow: 0 12px 34px rgba(43,38,29,.14);
        font: 13px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;
      }
      .portfolio-consent[hidden] { display: none !important; }
      .portfolio-consent--with-feedback { bottom: max(88px, calc(env(safe-area-inset-bottom) + 88px)); }
      .portfolio-consent__copy { min-width: 0; }
      .portfolio-consent strong { display: inline; margin-right: 7px; font-size: 13px; }
      .portfolio-consent p { display: inline; margin: 0; color: #6e6a61; }
      .portfolio-consent__actions { display: flex; flex-wrap: nowrap; gap: 7px; align-items: center; }
      .portfolio-consent button {
        appearance: none;
        border: 1px solid #d8d3c8;
        border-radius: 999px;
        padding: 8px 12px;
        font: 700 12px/1 -apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;
        white-space: nowrap;
        cursor: pointer;
      }
      .portfolio-consent button:active { transform: translateY(1px); }
      .portfolio-consent__accept { border-color: #1d4fd7 !important; background: #1d4fd7; color: #fdfcfa; }
      .portfolio-consent__accept:hover { background: #173fae; }
      .portfolio-consent__decline { background: transparent; color: #35322d; }
      .portfolio-consent__decline:hover { background: #f5f3ed; }
      .portfolio-consent a { color: #1d4fd7; font-weight: 700; text-underline-offset: 3px; white-space: nowrap; }
      @media (max-width: 720px) {
        .portfolio-consent {
          grid-template-columns: 1fr;
          gap: 9px;
          padding: 12px;
        }
        .portfolio-consent strong,
        .portfolio-consent p { display: block; }
        .portfolio-consent strong { margin: 0 0 2px; }
        .portfolio-consent__actions { flex-wrap: wrap; }
      }
      @media (prefers-reduced-transparency: reduce) {
        .portfolio-consent { background: #fdfcfa; }
      }
    `;
    document.head.appendChild(style);
  }

  function buildConsentUi() {
    injectStyles();
    const banner = document.createElement("section");
    banner.className = "portfolio-consent";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-modal", "false");
    banner.setAttribute("aria-label", copy.title);
    banner.innerHTML = `
      <div class="portfolio-consent__copy">
        <strong>${copy.title}</strong>
        <p>${copy.body}</p>
      </div>
      <div class="portfolio-consent__actions">
        <button class="portfolio-consent__accept" type="button">${copy.accept}</button>
        <button class="portfolio-consent__decline" type="button">${copy.decline}</button>
        <a href="${privacyHref()}">${copy.privacy}</a>
      </div>
    `;

    function choose(value) {
      saveConsent(value);
      sendConsent(value);
      banner.hidden = true;
    }

    banner.querySelector(".portfolio-consent__accept").addEventListener("click", () => {
      choose(CONSENT_GRANTED);
    });
    banner.querySelector(".portfolio-consent__decline").addEventListener("click", () => {
      choose(CONSENT_DENIED);
    });
    const consent = storedConsent();
    banner.hidden = consent === CONSENT_GRANTED || consent === CONSENT_DENIED;
    if (document.querySelector(".feedback-launcher")) {
      banner.classList.add("portfolio-consent--with-feedback");
    }
    document.body.append(banner);
  }

  const initialConsent = storedConsent();
  sendConsent(initialConsent);
  loadClarity();
  tagPageAndCampaign();
  trackKeyActions();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildConsentUi, { once: true });
  } else {
    buildConsentUi();
  }
})();

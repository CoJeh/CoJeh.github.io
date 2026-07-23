(function initFeedbackWidget() {
  "use strict";

  const CONTACT_EMAIL = "chen-chuting@hotmail.com";

  /*
   * Activation point: paste the Formspree endpoint between the quotes.
   * Example format: https://formspree.io/f/abcdefgh
   */
  const FORM_ENDPOINT = "";

  const locale = document.documentElement.lang.toLowerCase().startsWith("zh")
    ? "zh"
    : "en";
  const isDashboard = /dashboard(?:\.en)?\.html$/i.test(location.pathname);
  const source = isDashboard ? "spoton-dashboard" : "portfolio";

  if (isDashboard) {
    document.body.classList.add("feedback-context-dark");
  }

  const copy = {
    en: {
      launcher: "Leave feedback",
      title: "Leave a private note",
      intro: "Your message goes to Corrine for review. It is never posted automatically.",
      close: "Close feedback window",
      name: "Name",
      optional: "Optional",
      anonymous: "Post as Anonymous",
      namePlaceholder: "How should Corrine address you?",
      email: "Reply email",
      emailPlaceholder: "you@example.com",
      comment: "Comment",
      commentPlaceholder: "What stood out, or what could be improved?",
      reaction: "Your reaction",
      permission:
        "You may publish my comment on the public board after review. My email will never be displayed.",
      privateNote:
        "Private by default. Corrine can publish a note only when this permission is selected and she approves it.",
      submit: "Send privately",
      sending: "Sending...",
      success: "Thank you. Your note was sent privately to Corrine.",
      notConfigured:
        "Online sending is not active yet. Please use the email option.",
      failed: "The message could not be sent. Please use the email option.",
      emailFallback: "Email instead",
      contactTitle: "Stay in touch",
      contactCopy: "You can also email Corrine directly or follow her WeChat Official Account.",
      qrAlt: "QR code for Corrine's WeChat Official Account",
      qrCaption: "Scan with WeChat to follow",
      required: "Please enter a comment.",
      anonymousName: "Anonymous",
      permissionYes: "Yes",
      permissionNo: "No",
      reactionNone: "None",
      reactions: {
        like: "Like",
        celebrate: "Celebrate",
        support: "Support",
        love: "Love",
        insightful: "Insightful",
        funny: "Funny",
      },
      boardEmpty: "No approved comments yet. Be the first to leave a note.",
      showMore: "Show more",
      sources: {
        portfolio: "Portfolio",
        "spoton-dashboard": "SpotOn Dashboard",
      },
      approved: "Approved",
    },
    zh: {
      launcher: "留下反馈",
      title: "留下私密反馈",
      intro: "留言会私密发送给 Corrine 审核，不会自动公开。",
      close: "关闭反馈窗口",
      name: "姓名",
      optional: "选填",
      anonymous: "以 Anonymous 匿名提交",
      namePlaceholder: "Corrine 应该如何称呼你？",
      email: "回复邮箱",
      emailPlaceholder: "you@example.com",
      comment: "留言",
      commentPlaceholder: "哪部分最打动你，或有哪些地方可以改进？",
      reaction: "你的感受",
      permission:
        "我同意 Corrine 审核后将我的留言发布到公开留言板。我的邮箱绝不会公开。",
      privateNote:
        "默认保持私密。只有你勾选公开许可，并经 Corrine 审核通过后，留言才可能公开。",
      submit: "私密发送",
      sending: "发送中...",
      success: "谢谢，你的留言已私密发送给 Corrine。",
      notConfigured: "在线发送尚未启用，请使用邮件选项。",
      failed: "留言未能发送，请使用邮件选项。",
      emailFallback: "改用邮件",
      contactTitle: "保持联系",
      contactCopy: "你也可以直接发送邮件，或关注 Corrine 的微信公众号。",
      qrAlt: "Corrine 微信公众号二维码",
      qrCaption: "微信扫码关注公众号",
      required: "请填写留言内容。",
      anonymousName: "Anonymous",
      permissionYes: "是",
      permissionNo: "否",
      reactionNone: "无",
      reactions: {
        like: "赞",
        celebrate: "喝彩",
        support: "支持",
        love: "喜欢",
        insightful: "有启发",
        funny: "有趣",
      },
      boardEmpty: "暂时还没有精选留言，欢迎成为第一位留言者。",
      showMore: "显示更多",
      sources: {
        portfolio: "作品集",
        "spoton-dashboard": "SpotOn 项目看板",
      },
      approved: "审核通过",
    },
  };

  const t = copy[locale];
  const reactionOptions = [
    ["like", "👍"],
    ["celebrate", "🎉"],
    ["support", "🙌"],
    ["love", "❤️"],
    ["insightful", "💡"],
    ["funny", "😄"],
  ];

  function createElement(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function resolveDisplayName(name, anonymousSelected) {
    const cleanName = String(name || "").trim();
    return anonymousSelected || !cleanName ? t.anonymousName : cleanName;
  }

  function buildReactionOptions() {
    return reactionOptions
      .map(
        ([value, art]) => `
          <label class="feedback-reaction-option">
            <input type="radio" name="reaction" value="${value}">
            <span class="feedback-reaction-card">
              <span class="feedback-reaction-art" aria-hidden="true">${art}</span>
              <span>${t.reactions[value]}</span>
            </span>
          </label>`
      )
      .join("");
  }

  function buildWidget() {
    const launcher = createElement("button", "feedback-launcher");
    launcher.type = "button";
    launcher.setAttribute("aria-haspopup", "dialog");
    launcher.setAttribute("aria-controls", "feedback-dialog");
    launcher.setAttribute("aria-label", t.launcher);
    launcher.innerHTML = `
      <span class="feedback-launcher-icon" aria-hidden="true">💬</span>
      <span class="feedback-launcher-label">${t.launcher}</span>`;

    const dialog = createElement("dialog", "feedback-dialog");
    dialog.id = "feedback-dialog";
    dialog.setAttribute("aria-labelledby", "feedback-dialog-title");
    dialog.innerHTML = `
      <div class="feedback-dialog-shell">
        <div class="feedback-dialog-main">
          <div class="feedback-dialog-header">
            <div>
              <h2 class="feedback-dialog-title" id="feedback-dialog-title">${t.title}</h2>
              <p class="feedback-dialog-intro">${t.intro}</p>
            </div>
            <button class="feedback-dialog-close" type="button" aria-label="${t.close}">×</button>
          </div>
          <form class="feedback-form" novalidate>
            <div class="feedback-field">
              <div class="feedback-label-row">
                <label class="feedback-label" for="feedback-name">
                  ${t.name} <span class="feedback-optional">${t.optional}</span>
                </label>
                <label class="feedback-anonymous">
                  <input type="checkbox" name="anonymous_selected">
                  <span>${t.anonymous}</span>
                </label>
              </div>
              <input class="feedback-input" id="feedback-name" name="visitor_name"
                type="text" maxlength="80" autocomplete="name"
                placeholder="${t.namePlaceholder}">
            </div>

            <div class="feedback-field">
              <label class="feedback-label" for="feedback-email">
                ${t.email} <span class="feedback-optional">${t.optional}</span>
              </label>
              <input class="feedback-input" id="feedback-email" name="email"
                type="email" maxlength="160" autocomplete="email"
                placeholder="${t.emailPlaceholder}">
            </div>

            <div class="feedback-field">
              <label class="feedback-label" for="feedback-comment">${t.comment}</label>
              <textarea class="feedback-textarea" id="feedback-comment" name="message"
                maxlength="2000" required placeholder="${t.commentPlaceholder}"></textarea>
            </div>

            <fieldset class="feedback-reactions">
              <legend class="feedback-reaction-legend">${t.reaction}
                <span class="feedback-optional">${t.optional}</span>
              </legend>
              ${buildReactionOptions()}
            </fieldset>

            <label class="feedback-consent">
              <input type="checkbox" name="public_permission">
              <span>${t.permission}</span>
            </label>

            <p class="feedback-private-note">${t.privateNote}</p>

            <div class="feedback-honeypot" aria-hidden="true">
              <label for="feedback-website">Website</label>
              <input id="feedback-website" name="_gotcha" type="text" tabindex="-1" autocomplete="off">
            </div>

            <div class="feedback-actions">
              <button class="feedback-submit" type="submit">${t.submit}</button>
              <a class="feedback-email-fallback" href="mailto:${CONTACT_EMAIL}">${t.emailFallback}</a>
            </div>
            <p class="feedback-status" role="status" aria-live="polite"></p>
          </form>
        </div>

        <aside class="feedback-dialog-side">
          <div class="feedback-dialog-side-inner">
            <img class="feedback-qr" src="assets/contact/wechat-official-account-qr.jpg"
              alt="${t.qrAlt}" width="430" height="430">
            <div class="feedback-side-copy">
              <h3 class="feedback-side-title">${t.contactTitle}</h3>
              <p>${t.contactCopy}</p>
              <a class="feedback-contact-email" href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>
              <p class="feedback-qr-caption">${t.qrCaption}</p>
            </div>
          </div>
        </aside>
      </div>`;

    document.body.append(launcher, dialog);

    const form = dialog.querySelector(".feedback-form");
    const close = dialog.querySelector(".feedback-dialog-close");
    const name = dialog.querySelector('[name="visitor_name"]');
    const anonymous = dialog.querySelector('[name="anonymous_selected"]');
    const comment = dialog.querySelector('[name="message"]');
    const permission = dialog.querySelector('[name="public_permission"]');
    const submit = dialog.querySelector(".feedback-submit");
    const status = dialog.querySelector(".feedback-status");
    const emailFallback = dialog.querySelector(".feedback-email-fallback");

    function setStatus(message, state) {
      status.textContent = message;
      status.dataset.state = state || "";
    }

    function openDialog() {
      setStatus("", "");
      dialog.showModal();
      document.body.classList.add("feedback-modal-open");
      window.setTimeout(() => comment.focus(), 0);
    }

    function closeDialog() {
      dialog.close();
    }

    function syncAnonymousState() {
      if (anonymous.checked) {
        name.value = "";
        name.disabled = true;
      } else {
        name.disabled = false;
      }
    }

    function selectedReaction() {
      return form.querySelector('[name="reaction"]:checked')?.value || "";
    }

    function buildMailto() {
      const displayName = resolveDisplayName(name.value, anonymous.checked);
      const replyEmail = form.elements.email.value.trim();
      const reaction = selectedReaction();
      const lines = [
        `Name: ${displayName}`,
        `Reply email: ${replyEmail || t.reactionNone}`,
        `Reaction: ${reaction ? t.reactions[reaction] : t.reactionNone}`,
        `Public permission: ${permission.checked ? t.permissionYes : t.permissionNo}`,
        `Page: ${document.title}`,
        `URL: ${location.href}`,
        "",
        comment.value.trim(),
      ];
      const subjectLine =
        locale === "zh" ? `作品集反馈：${document.title}` : `Portfolio feedback: ${document.title}`;
      emailFallback.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
        subjectLine
      )}&body=${encodeURIComponent(lines.join("\n"))}`;
    }

    function submissionPayload() {
      const displayName = resolveDisplayName(name.value, anonymous.checked);
      const reaction = selectedReaction();
      const payload = {
        name: displayName,
        anonymous_selected: anonymous.checked ? "Yes" : "No",
        message: comment.value.trim(),
        reaction: reaction ? t.reactions[reaction] : t.reactionNone,
        public_permission: permission.checked ? "Yes" : "No",
        page_title: document.title,
        page_url: location.href,
        language: locale,
        source,
        _subject: `Portfolio feedback: ${source}`,
        _gotcha: form.elements._gotcha.value,
      };
      const replyEmail = form.elements.email.value.trim();
      if (replyEmail) payload.email = replyEmail;
      return payload;
    }

    async function submitForm(event) {
      event.preventDefault();
      buildMailto();

      if (!comment.value.trim()) {
        comment.setCustomValidity(t.required);
        comment.reportValidity();
        comment.setCustomValidity("");
        setStatus(t.required, "error");
        return;
      }

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      if (!FORM_ENDPOINT) {
        setStatus(t.notConfigured, "error");
        emailFallback.focus();
        return;
      }

      submit.disabled = true;
      submit.textContent = t.sending;
      setStatus(t.sending, "");

      try {
        const response = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionPayload()),
        });

        if (!response.ok) {
          throw new Error(`Form service returned ${response.status}`);
        }

        form.reset();
        syncAnonymousState();
        buildMailto();
        setStatus(t.success, "success");
      } catch (error) {
        console.warn("Feedback submission failed.", error);
        setStatus(t.failed, "error");
        emailFallback.focus();
      } finally {
        submit.disabled = false;
        submit.textContent = t.submit;
      }
    }

    launcher.addEventListener("click", openDialog);
    close.addEventListener("click", closeDialog);
    anonymous.addEventListener("change", syncAnonymousState);
    form.addEventListener("input", buildMailto);
    form.addEventListener("change", buildMailto);
    form.addEventListener("submit", submitForm);

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closeDialog();
    });

    dialog.addEventListener("close", () => {
      document.body.classList.remove("feedback-modal-open");
      launcher.focus();
    });

    syncAnonymousState();
    buildMailto();
  }

  function safeDate(value) {
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.valueOf()) ? null : date;
  }

  function renderBoard() {
    const mount = document.querySelector("[data-feedback-board]");
    if (!mount) return;

    const records = Array.isArray(window.APPROVED_COMMENTS)
      ? window.APPROVED_COMMENTS.slice()
      : [];
    const approved = records
      .filter(
        (record) =>
          record &&
          typeof record.id === "string" &&
          typeof record.displayName === "string" &&
          typeof record.comment === "string" &&
          typeof record.approvedDate === "string"
      )
      .sort((a, b) => b.approvedDate.localeCompare(a.approvedDate));

    if (!approved.length) {
      mount.replaceChildren(createElement("p", "feedback-board-empty", t.boardEmpty));
      return;
    }

    const grid = createElement("div", "feedback-board-grid");
    const controls = createElement("div", "feedback-board-controls");
    const more = createElement("button", "feedback-board-more", t.showMore);
    more.type = "button";
    let visible = 6;

    function reactionLabel(value) {
      return t.reactions[value] || "";
    }

    function reactionArt(value) {
      return reactionOptions.find(([key]) => key === value)?.[1] || "";
    }

    function sourceLabel(value) {
      return t.sources[value] || String(value || "");
    }

    function renderVisible() {
      grid.replaceChildren();
      approved.slice(0, visible).forEach((record) => {
        const card = createElement("article", "feedback-comment-card");
        const copyNode = createElement("p", "feedback-comment-copy", record.comment);
        const meta = createElement("div", "feedback-comment-meta");
        const identity = createElement("div");
        identity.append(
          createElement("div", "feedback-comment-name", record.displayName || t.anonymousName)
        );

        if (record.reaction && reactionLabel(record.reaction)) {
          const reaction = createElement("div", "feedback-comment-reaction");
          const art = createElement("span", "", reactionArt(record.reaction));
          art.setAttribute("aria-hidden", "true");
          reaction.append(art, document.createTextNode(reactionLabel(record.reaction)));
          identity.append(reaction);
        }

        const detail = createElement("div", "feedback-comment-detail");
        const date = safeDate(record.approvedDate);
        const formattedDate = date
          ? new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-GB", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }).format(date)
          : record.approvedDate;
        detail.append(
          createElement("div", "", sourceLabel(record.source)),
          createElement("div", "", `${t.approved} ${formattedDate}`)
        );
        meta.append(identity, detail);
        card.append(copyNode, meta);
        grid.append(card);
      });

      more.hidden = visible >= approved.length;
    }

    more.addEventListener("click", () => {
      visible += 6;
      renderVisible();
    });
    controls.append(more);
    mount.replaceChildren(grid, controls);
    renderVisible();
  }

  buildWidget();
  renderBoard();
})();

(function initFeedbackWidget() {
  "use strict";

  const CONTACT_EMAIL = "chen-chuting@hotmail.com";
  const FORM_ENDPOINT = "https://formspree.io/f/xykrdovb";
  const INTERACTIONS_API =
    "https://corrine-portfolio-feedback.corrine-chan1993.workers.dev";
  const MAX_SOURCE_BYTES = 5 * 1024 * 1024;
  const MAX_PROCESSED_BYTES = 500 * 1024;
  const AVATAR_SIZE = 512;
  const PRESET_AVATARS = {
    male: "assets/comments/avatars/placeholder-comic-male.svg",
    female: "assets/comments/avatars/placeholder-comic-female.svg",
    robot: "assets/comments/avatars/placeholder-robot.svg",
  };

  const locale = document.documentElement.lang.toLowerCase().startsWith("zh")
    ? "zh"
    : "en";
  const isDashboard = /dashboard(?:\.en|-standalone)?\.html$/i.test(location.pathname);
  const source = isDashboard ? "spoton-dashboard" : "portfolio";

  if (isDashboard) document.body.classList.add("feedback-context-dark");

  const copy = {
    en: {
      launcher: "Leave feedback",
      title: "Leave a private note",
      intro: "Your message goes to Corrine for review. It is never posted automatically.",
      close: "Close feedback window",
      name: "Name",
      optional: "Optional",
      anonymous: "Post as Anonymous",
      namePlaceholder: "Hi Cool Beans, how may I address you? 😉",
      email: "Reply email",
      emailPlaceholder: "you@example.com",
      avatarLegend: "Choose a profile picture",
      avatarHint: "This will appear only if Corrine approves your public comment.",
      avatarMale: "Comic male",
      avatarFemale: "Comic female",
      avatarRobot: "Robot",
      avatarCustom: "Upload yours",
      avatarChange: "Change image",
      avatarRemove: "Remove",
      avatarUploadHint: "JPG, PNG or WebP · up to 5MB",
      avatarInvalidType: "Please choose a valid JPG, PNG or WebP image.",
      avatarTooLarge: "The original image must be 5MB or smaller.",
      avatarBroken: "This image could not be read. Please choose another file.",
      avatarProcessing: "Preparing your image…",
      avatarUploadFailed:
        "The private avatar upload failed. Please retry or choose a virtual avatar. Your comment is still here.",
      avatarAnonymous:
        "Custom images are removed in anonymous mode. The robot avatar is now selected.",
      comment: "Comment",
      commentPlaceholder: "What stood out, or what could be improved?",
      reaction: "Your reactions",
      reactionHint: "Choose as many as you like.",
      permission:
        "After review, Corrine may publish my comment and selected avatar. My email will never be displayed. If I upload an image, I confirm I have the right to use it.",
      privateNote:
        "Private by default. Nothing is published automatically; Corrine reviews the message and avatar together.",
      submit: "Send privately",
      sending: "Sending…",
      uploading: "Uploading your avatar privately…",
      successTitle: "Message sent successfully",
      success: "Thank you. Your private note has reached Corrine.",
      successClose: "Done",
      notConfigured: "Online sending is not active yet. Please use the email option.",
      failed: "The message could not be sent. Please use the email option.",
      emailFallback: "Email instead",
      contactTitle: "Stay in Touch",
      contactCopy:
        "Have ideas or suggestions you'd like to bounce around with Corrine? Let's brainstorm together—email me at:",
      qrAlt: "QR code for Corrine's WeChat Official Account",
      qrCaption: "Scan with WeChat to follow Corrine's AI experiments and latest updates",
      accountLabel: "WeChat Official Account:",
      accountName: "小Co大ai",
      required: "Please enter a comment.",
      anonymousName: "Anonymous",
      permissionYes: "Yes",
      permissionNo: "No",
      reactionNone: "None",
      avatarNotProvided: "Not provided",
      reactions: {
        like: "Like",
        celebrate: "Celebrate",
        support: "Support",
        love: "Love",
        insightful: "Insightful",
        funny: "Funny",
      },
      boardEmpty: "No approved comments yet. Be the first to leave a note.",
      sources: {
        portfolio: "Portfolio",
        "spoton-dashboard": "SpotOn Dashboard",
      },
      sourcePrefix: "From",
      previousComment: "Previous comment",
      nextComment: "Next comment",
      carouselLabel: "Visitor comments",
      commentPosition: (current, total) => `Comment ${current} of ${total}`,
      approved: "Published",
      originalComment: "Original comment",
      translation: "English summary",
      aiTranslation: "This is AI auto-translated",
      viewOriginal: "Click to view original comment",
      hideOriginal: "Hide original comment",
      replyTitle: "Reply from Author",
      replyPlaceholder:
        "Thank you for being the first person to leave a note here. Your thoughtful ideas are already helping me improve this space.",
      likeComment: "Like this comment",
      unlikeComment: "Remove your like",
      likesUnavailable: "Shared likes are temporarily unavailable.",
    },
    zh: {
      launcher: "欢迎与我交流",
      title: "欢迎给我留言",
      intro: "留言会私密发送给 Corrine 审核，不会自动公开。",
      close: "关闭反馈窗口",
      name: "昵称",
      optional: "选填",
      anonymous: "匿名提交",
      namePlaceholder: "大侠请留名 🙇‍♀️",
      email: "回复邮箱",
      emailPlaceholder: "you@example.com",
      avatarLegend: "选择头像",
      avatarHint: "仅当 Corrine 批准公开你的留言时，头像才会显示。",
      avatarMale: "漫画男生",
      avatarFemale: "漫画女生",
      avatarRobot: "机器人",
      avatarCustom: "上传图片",
      avatarChange: "更换图片",
      avatarRemove: "移除",
      avatarUploadHint: "JPG、PNG 或 WebP · 最大 5MB",
      avatarInvalidType: "请选择有效的 JPG、PNG 或 WebP 图片。",
      avatarTooLarge: "原始图片不能超过 5MB。",
      avatarBroken: "无法读取这张图片，请重新选择。",
      avatarProcessing: "正在处理图片…",
      avatarUploadFailed:
        "头像未能上传到私密审核区，请重试或改用虚拟头像；你的留言正文仍然保留。",
      avatarAnonymous: "匿名模式不会保留自定义图片，现已自动切换为机器人头像。",
      comment: "留言",
      commentPlaceholder: "哪部分最打动你，或有哪些地方可以改进？",
      reaction: "你的感受",
      reactionHint: "可以多选，喜欢的都选上。",
      permission:
        "我同意 Corrine 审核后公开我的留言和所选头像；邮箱绝不会公开。如上传图片，我确认自己有权使用该图片。",
      privateNote: "默认保持私密，不会自动公开；Corrine 会同时审核留言与头像。",
      submit: "发送私信",
      sending: "发送中…",
      uploading: "正在将头像上传到私密审核区…",
      successTitle: "留言发送成功",
      success: "谢谢，你的私密留言已成功发送给 Corrine。",
      successClose: "完成",
      notConfigured: "在线发送尚未启用，请使用邮件选项。",
      failed: "留言未能发送，请使用邮件选项。",
      emailFallback: "改用邮件",
      contactTitle: "保持联系",
      contactCopy: "有任何想法和建议，想要来和 Corrine 对对碰，一起头脑风暴？欢迎直接发送邮件到：",
      qrAlt: "Corrine 微信公众号二维码",
      qrCaption: "微信扫码，关注Corrine的AI实验与新动态",
      accountLabel: "微信公众号：",
      accountName: "小Co大ai",
      required: "请填写留言内容。",
      anonymousName: "Anonymous",
      permissionYes: "是",
      permissionNo: "否",
      reactionNone: "无",
      avatarNotProvided: "未提供",
      reactions: {
        like: "赞",
        celebrate: "喝彩",
        support: "支持",
        love: "喜欢",
        insightful: "有启发",
        funny: "有趣",
      },
      boardEmpty: "暂时还没有精选留言，欢迎成为第一位留言者。",
      sources: {
        portfolio: "主页",
        "spoton-dashboard": "SpotOn 项目看板",
      },
      sourcePrefix: "来源",
      previousComment: "上一条留言",
      nextComment: "下一条留言",
      carouselLabel: "访客留言",
      commentPosition: (current, total) => `第 ${current} / ${total} 条留言`,
      approved: "发布于",
      originalComment: "原始留言",
      translation: "英文摘要",
      aiTranslation: "此内容由 AI 自动翻译",
      viewOriginal: "查看原始留言",
      hideOriginal: "收起原始留言",
      replyTitle: "作者回复",
      replyPlaceholder: "谢谢你成为这里第一位留言的朋友。你的细致体验和建议，已经在帮助我把这个空间做得更好。",
      likeComment: "赞同这条留言",
      unlikeComment: "取消点赞",
      likesUnavailable: "共享点赞暂时不可用。",
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
  const avatarOptions = [
    ["male", t.avatarMale],
    ["female", t.avatarFemale],
    ["robot", t.avatarRobot],
    ["custom", t.avatarCustom],
  ];

  function createElement(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function createLinkedReply(text, linkSpec) {
    const paragraph = createElement("p");
    const linkText = String(linkSpec?.text || "").trim();
    const linkHref = String(linkSpec?.href || "").trim();
    const linkStart = linkText ? text.indexOf(linkText) : -1;

    if (linkStart < 0 || !linkHref.startsWith("https://")) {
      paragraph.textContent = text;
      return paragraph;
    }

    const link = createElement("a", "feedback-author-reply-link", linkText);
    link.href = linkHref;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    paragraph.append(
      document.createTextNode(text.slice(0, linkStart)),
      link,
      document.createTextNode(text.slice(linkStart + linkText.length))
    );
    return paragraph;
  }

  function escapeAttribute(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll('"', "&quot;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
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
            <input type="checkbox" name="reaction" value="${value}">
            <span class="feedback-reaction-card">
              <span class="feedback-reaction-art" aria-hidden="true">${art}</span>
              <span>${t.reactions[value]}</span>
            </span>
          </label>`
      )
      .join("");
  }

  function buildAvatarOptions() {
    return avatarOptions
      .map(([value, label]) => {
        const visibleLabel =
          value === "custom"
            ? `<span class="feedback-avatar-label">${label}</span>`
            : "";
        const preview =
          value === "custom"
            ? `<span class="feedback-avatar-upload-mark" aria-hidden="true">＋</span>`
            : `<img src="${PRESET_AVATARS[value]}" alt="" width="96" height="96">`;
        return `
          <label class="feedback-avatar-option">
            <input type="radio" name="avatar_choice" value="${value}"
              aria-label="${escapeAttribute(label)}" ${
              value === "robot" ? "checked" : ""
            }>
            <span class="feedback-avatar-card">
              <span class="feedback-avatar-preview" data-avatar-preview="${value}">${preview}</span>
              ${visibleLabel}
            </span>
          </label>`;
      })
      .join("");
  }

  function fileExtension(name) {
    const match = /\.([a-z0-9]+)$/i.exec(String(name || ""));
    return match ? match[1].toLowerCase() : "";
  }

  function detectedImageType(bytes) {
    if (
      bytes.length >= 12 &&
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50
    ) {
      return "image/webp";
    }
    if (
      bytes.length >= 8 &&
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a
    ) {
      return "image/png";
    }
    if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
      return "image/jpeg";
    }
    return "";
  }

  function canvasBlob(canvas, type, quality) {
    return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
  }

  async function loadBitmap(file) {
    if ("createImageBitmap" in window) return createImageBitmap(file);
    const url = URL.createObjectURL(file);
    try {
      const image = new Image();
      image.decoding = "async";
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
        image.src = url;
      });
      return image;
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  async function processAvatar(file) {
    if (!file || file.size > MAX_SOURCE_BYTES) {
      throw new Error(file?.size > MAX_SOURCE_BYTES ? "too-large" : "invalid-type");
    }

    const allowedExtensions = new Set(["jpg", "jpeg", "png", "webp"]);
    const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
    const signature = detectedImageType(new Uint8Array(await file.slice(0, 16).arrayBuffer()));
    if (
      !allowedExtensions.has(fileExtension(file.name)) ||
      !allowedTypes.has(file.type) ||
      !signature ||
      signature !== file.type
    ) {
      throw new Error("invalid-type");
    }

    let bitmap;
    try {
      bitmap = await loadBitmap(file);
    } catch {
      throw new Error("broken");
    }

    const width = bitmap.naturalWidth || bitmap.width;
    const height = bitmap.naturalHeight || bitmap.height;
    if (!width || !height) throw new Error("broken");

    const canvas = document.createElement("canvas");
    canvas.width = AVATAR_SIZE;
    canvas.height = AVATAR_SIZE;
    const context = canvas.getContext("2d", { alpha: false });
    context.fillStyle = "#fefcf6";
    context.fillRect(0, 0, AVATAR_SIZE, AVATAR_SIZE);
    const crop = Math.min(width, height);
    const sx = Math.round((width - crop) / 2);
    const sy = Math.round((height - crop) / 2);
    context.drawImage(bitmap, sx, sy, crop, crop, 0, 0, AVATAR_SIZE, AVATAR_SIZE);
    if (typeof bitmap.close === "function") bitmap.close();

    let blob = null;
    let outputType = "image/webp";
    for (const quality of [0.86, 0.76, 0.66, 0.56]) {
      blob = await canvasBlob(canvas, "image/webp", quality);
      if (blob?.type === "image/webp" && blob.size <= MAX_PROCESSED_BYTES) break;
      blob = null;
    }

    if (!blob) {
      outputType = "image/jpeg";
      for (const quality of [0.86, 0.76, 0.66, 0.56]) {
        blob = await canvasBlob(canvas, outputType, quality);
        if (blob && blob.size <= MAX_PROCESSED_BYTES) break;
        blob = null;
      }
    }

    if (!blob) throw new Error("broken");
    return new File([blob], outputType === "image/webp" ? "avatar.webp" : "avatar.jpg", {
      type: outputType,
      lastModified: Date.now(),
    });
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
    dialog.setAttribute("data-clarity-mask", "true");
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
          <div class="feedback-success-panel" role="status" aria-live="polite" tabindex="-1" hidden>
            <div class="feedback-success-mark" aria-hidden="true">✓</div>
            <h3>${t.successTitle}</h3>
            <p>${t.success}</p>
            <button class="feedback-success-close" type="button">${t.successClose}</button>
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
                placeholder="${escapeAttribute(t.namePlaceholder)}">
            </div>

            <fieldset class="feedback-avatars">
              <legend class="feedback-avatar-legend">${t.avatarLegend}</legend>
              <p class="feedback-avatar-hint">${t.avatarHint}</p>
              <div class="feedback-avatar-options">${buildAvatarOptions()}</div>
              <input class="feedback-avatar-file" id="feedback-avatar-file" type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp">
              <div class="feedback-avatar-actions" hidden>
                <button class="feedback-avatar-change" type="button">${t.avatarChange}</button>
                <button class="feedback-avatar-remove" type="button">${t.avatarRemove}</button>
              </div>
              <p class="feedback-avatar-file-hint">${t.avatarUploadHint}</p>
              <p class="feedback-avatar-status" role="status" aria-live="polite"></p>
            </fieldset>

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
              <p class="feedback-reaction-hint">${t.reactionHint}</p>
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
            <h3 class="feedback-side-title">${t.contactTitle}</h3>
            <p class="feedback-side-description">${t.contactCopy}</p>
            <a class="feedback-contact-email" href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>
            <p class="feedback-qr-caption">${t.qrCaption}</p>
            <img class="feedback-qr" src="assets/contact/wechat-official-account-qr.jpg"
              alt="${t.qrAlt}" width="430" height="430">
            <p class="feedback-account-name">
              <span class="feedback-account-label">${t.accountLabel}</span>
              <span class="feedback-account-value">${t.accountName}</span>
            </p>
          </div>
        </aside>
      </div>`;

    document.body.append(launcher, dialog);

    const form = dialog.querySelector(".feedback-form");
    const dialogShell = dialog.querySelector(".feedback-dialog-shell");
    const close = dialog.querySelector(".feedback-dialog-close");
    const successPanel = dialog.querySelector(".feedback-success-panel");
    const successClose = dialog.querySelector(".feedback-success-close");
    const name = dialog.querySelector('[name="visitor_name"]');
    const anonymous = dialog.querySelector('[name="anonymous_selected"]');
    const comment = dialog.querySelector('[name="message"]');
    const permission = dialog.querySelector('[name="public_permission"]');
    const submit = dialog.querySelector(".feedback-submit");
    const status = dialog.querySelector(".feedback-status");
    const emailFallback = dialog.querySelector(".feedback-email-fallback");
    const avatarFile = dialog.querySelector(".feedback-avatar-file");
    const avatarActions = dialog.querySelector(".feedback-avatar-actions");
    const avatarChange = dialog.querySelector(".feedback-avatar-change");
    const avatarRemove = dialog.querySelector(".feedback-avatar-remove");
    const avatarStatus = dialog.querySelector(".feedback-avatar-status");
    const customAvatarPreview = dialog.querySelector('[data-avatar-preview="custom"]');
    let processedAvatar = null;
    let customPreviewUrl = "";
    let processingAvatar = false;

    function setStatus(message, state) {
      status.textContent = message;
      status.dataset.state = state || "";
    }

    function setAvatarStatus(message, state) {
      avatarStatus.textContent = message;
      avatarStatus.dataset.state = state || "";
    }

    function selectedAvatar() {
      return form.querySelector('[name="avatar_choice"]:checked')?.value || "robot";
    }

    function chooseAvatar(value) {
      const option = form.querySelector(`[name="avatar_choice"][value="${value}"]`);
      if (option) {
        option.checked = true;
        option.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }

    function clearCustomAvatar({ selectRobot = false } = {}) {
      processedAvatar = null;
      avatarFile.value = "";
      if (customPreviewUrl) URL.revokeObjectURL(customPreviewUrl);
      customPreviewUrl = "";
      customAvatarPreview.replaceChildren(
        Object.assign(createElement("span", "feedback-avatar-upload-mark", "＋"), {
          ariaHidden: "true",
        })
      );
      avatarActions.hidden = true;
      setAvatarStatus("", "");
      if (selectRobot) chooseAvatar("robot");
    }

    async function handleAvatarFile(file) {
      processingAvatar = true;
      setAvatarStatus(t.avatarProcessing, "");
      try {
        const result = await processAvatar(file);
        clearCustomAvatar();
        processedAvatar = result;
        customPreviewUrl = URL.createObjectURL(result);
        const preview = new Image(96, 96);
        preview.src = customPreviewUrl;
        preview.alt = "";
        customAvatarPreview.replaceChildren(preview);
        avatarActions.hidden = false;
        chooseAvatar("custom");
        setAvatarStatus("", "");
      } catch (error) {
        const key = error?.message;
        const message =
          key === "too-large"
            ? t.avatarTooLarge
            : key === "invalid-type"
              ? t.avatarInvalidType
              : t.avatarBroken;
        clearCustomAvatar({ selectRobot: true });
        setAvatarStatus(message, "error");
      } finally {
        processingAvatar = false;
      }
    }

    function openDialog() {
      setStatus("", "");
      form.hidden = false;
      successPanel.hidden = true;
      dialog.showModal();
      document.body.classList.add("feedback-modal-open");
      window.setTimeout(() => name.focus(), 0);
    }

    function closeDialog() {
      dialog.close();
    }

    function syncAnonymousState() {
      if (anonymous.checked) {
        name.value = "";
        name.disabled = true;
        if (selectedAvatar() === "custom" || processedAvatar) {
          clearCustomAvatar({ selectRobot: true });
          setAvatarStatus(t.avatarAnonymous, "notice");
        }
      } else {
        name.disabled = false;
      }
    }

    function selectedReactions() {
      return Array.from(form.querySelectorAll('[name="reaction"]:checked')).map(
        (input) => input.value
      );
    }

    function reactionText() {
      const values = selectedReactions();
      return values.length ? values.map((value) => t.reactions[value]).join(", ") : t.reactionNone;
    }

    function buildMailto() {
      const displayName = resolveDisplayName(name.value, anonymous.checked);
      const replyEmail = form.elements.email.value.trim();
      const avatarChoice = selectedAvatar();
      const lines = [
        `Name: ${displayName}`,
        `Reply email: ${replyEmail || t.reactionNone}`,
        `Avatar: ${avatarChoice}`,
        `Reactions: ${reactionText()}`,
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

    function submissionPayload(avatarUpload) {
      const displayName = resolveDisplayName(name.value, anonymous.checked);
      const avatarChoice = selectedAvatar();
      const payload = {
        name: displayName,
        anonymous_selected: anonymous.checked ? "Yes" : "No",
        avatar_choice: avatarChoice,
        message: comment.value.trim(),
        reaction: reactionText(),
        public_permission: permission.checked ? "Yes" : "No",
        page_title: document.title,
        page_url: location.href,
        language: locale,
        source,
        _subject: `Portfolio feedback: ${source}`,
        _gotcha: form.elements._gotcha.value,
      };
      if (avatarChoice === "custom" && !permission.checked) {
        payload.avatar_review_status = "Private preview only — not uploaded";
      }
      if (avatarUpload) {
        payload.avatar_upload_id = avatarUpload.uploadId;
        payload.avatar_review_url = avatarUpload.reviewUrl;
      }
      const replyEmail = form.elements.email.value.trim();
      if (replyEmail) payload.email = replyEmail;
      return payload;
    }

    async function uploadCustomAvatar() {
      if (selectedAvatar() !== "custom" || !permission.checked) return null;
      if (!processedAvatar) throw new Error("missing-avatar");
      const response = await fetch(`${INTERACTIONS_API}/v1/avatar-uploads`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": processedAvatar.type,
          "X-File-Size": String(processedAvatar.size),
        },
        body: processedAvatar,
      });
      if (!response.ok) throw new Error(`Avatar service returned ${response.status}`);
      const result = await response.json();
      if (!result.uploadId || !result.reviewUrl) throw new Error("Invalid avatar response");
      return result;
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
      if (processingAvatar) {
        setStatus(t.avatarProcessing, "error");
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
        let avatarUpload = null;
        if (selectedAvatar() === "custom" && permission.checked) {
          submit.textContent = t.uploading;
          setStatus(t.uploading, "");
          try {
            avatarUpload = await uploadCustomAvatar();
          } catch (error) {
            console.warn("Private avatar upload failed.", error);
            setStatus(t.avatarUploadFailed, "error");
            return;
          }
        }

        submit.textContent = t.sending;
        setStatus(t.sending, "");
        const response = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionPayload(avatarUpload)),
        });
        if (!response.ok) throw new Error(`Form service returned ${response.status}`);

        form.reset();
        clearCustomAvatar();
        chooseAvatar("robot");
        syncAnonymousState();
        buildMailto();
        setStatus("", "");
        form.hidden = true;
        successPanel.hidden = false;
        dialogShell.scrollTop = 0;
        document.dispatchEvent(new CustomEvent("portfolio:feedback-submitted"));
        window.setTimeout(() => successPanel.focus(), 0);
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
    successClose.addEventListener("click", closeDialog);
    anonymous.addEventListener("change", syncAnonymousState);
    avatarFile.addEventListener("change", () => {
      const file = avatarFile.files?.[0];
      if (file) handleAvatarFile(file);
    });
    avatarChange.addEventListener("click", () => avatarFile.click());
    avatarRemove.addEventListener("click", () => clearCustomAvatar({ selectRobot: true }));
    form.querySelectorAll('[name="avatar_choice"]').forEach((input) => {
      input.addEventListener("change", () => {
        if (!input.checked) return;
        if (anonymous.checked && input.value === "custom") {
          clearCustomAvatar({ selectRobot: true });
          setAvatarStatus(t.avatarAnonymous, "notice");
          return;
        }
        if (input.value === "custom" && !processedAvatar) avatarFile.click();
        buildMailto();
      });
    });
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

  function reactionLabel(value) {
    return t.reactions[value] || "";
  }

  function reactionArt(value) {
    return reactionOptions.find(([key]) => key === value)?.[1] || "";
  }

  function sourceLabel(value) {
    return t.sources[value] || String(value || "");
  }

  function createAvatar(record) {
    const wrap = createElement("span", "feedback-comment-avatar");
    if (record.avatarType === "initial") {
      wrap.textContent = String(record.avatarInitial || "?").slice(0, 1).toUpperCase();
      wrap.setAttribute("role", "img");
      wrap.setAttribute("aria-label", locale === "zh" ? record.avatarAlt : record.avatarAltEn);
      return wrap;
    }
    const src =
      record.avatarType === "preset"
        ? PRESET_AVATARS[record.avatarKey]
        : record.avatarType === "asset"
          ? record.avatarSrc
          : "";
    if (!src) {
      wrap.textContent = "?";
      return wrap;
    }
    const image = new Image(48, 48);
    image.src = src;
    image.alt = locale === "zh" ? record.avatarAlt || "" : record.avatarAltEn || "";
    wrap.append(image);
    return wrap;
  }

  const LIKE_LOOKUP_RETRY_DELAYS_MS = [0, 800, 2400];
  const LIKE_LOOKUP_TIMEOUT_MS = 5000;
  const LIKE_COUNT_CACHE_KEY = "corrine-feedback-like-counts-v1";
  const likeButtonRegistry = new Map();
  let volatileVoterToken = "";

  function createVoterToken() {
    return typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${crypto.getRandomValues(new Uint32Array(4)).join("-")}`;
  }

  function voterToken() {
    const key = "corrine-feedback-voter";
    try {
      let token = localStorage.getItem(key);
      if (!token) {
        token = createVoterToken();
        localStorage.setItem(key, token);
      }
      return token;
    } catch {
      try {
        let token = sessionStorage.getItem(key);
        if (!token) {
          token = createVoterToken();
          sessionStorage.setItem(key, token);
        }
        return token;
      } catch {
        if (!volatileVoterToken) volatileVoterToken = createVoterToken();
        return volatileVoterToken;
      }
    }
  }

  function normaliseLikeCount(value, fallback = 0) {
    return Number.isFinite(Number(value))
      ? Math.max(0, Math.trunc(Number(value)))
      : fallback;
  }

  function readLikeCountCache() {
    for (const storage of [localStorage, sessionStorage]) {
      try {
        const raw = storage.getItem(LIKE_COUNT_CACHE_KEY);
        if (!raw) continue;
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          return parsed;
        }
      } catch {
        // Continue to the next browser storage option.
      }
    }
    return {};
  }

  function rememberLikeCount(recordId, count) {
    const cache = readLikeCountCache();
    cache[recordId] = normaliseLikeCount(count);
    const serialised = JSON.stringify(cache);
    for (const storage of [localStorage, sessionStorage]) {
      try {
        storage.setItem(LIKE_COUNT_CACHE_KEY, serialised);
        return;
      } catch {
        // Continue to the next browser storage option.
      }
    }
  }

  function lastKnownLikeCount(recordId, publishedCount) {
    const cached = readLikeCountCache()[recordId];
    return normaliseLikeCount(cached, normaliseLikeCount(publishedCount));
  }

  function wait(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  async function fetchLikeItem(recordId, token) {
    let lastError = new Error("Like lookup failed");
    const voterQuery = token ? `&voter=${encodeURIComponent(token)}` : "";
    const endpoint = `${INTERACTIONS_API}/v1/likes?ids=${encodeURIComponent(
      recordId
    )}${voterQuery}`;

    for (const retryDelay of LIKE_LOOKUP_RETRY_DELAYS_MS) {
      if (retryDelay) await wait(retryDelay);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), LIKE_LOOKUP_TIMEOUT_MS);
      try {
        const response = await fetch(endpoint, {
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Like lookup failed");
        const result = await response.json();
        const item = result.items?.[recordId];
        if (!item || !Number.isFinite(Number(item.count))) {
          throw new Error("Like lookup returned incomplete data");
        }
        return item;
      } catch (error) {
        lastError = error;
      } finally {
        clearTimeout(timeout);
      }
    }
    throw lastError;
  }

  async function hydrateLike(button, recordId) {
    if (button.dataset.hydrating === "true") return;
    const token = voterToken();
    button.dataset.hydrating = "true";
    try {
      const item = await fetchLikeItem(recordId, token);
      const count = normaliseLikeCount(item.count, Number(button.dataset.count) || 0);
      button.dataset.count = String(count);
      button.setAttribute("aria-pressed", item.liked ? "true" : "false");
      button.querySelector(".feedback-like-count").textContent = String(count);
      button.title = item.liked ? t.unlikeComment : t.likeComment;
      button.disabled = !token;
      rememberLikeCount(recordId, count);
    } catch (error) {
      console.warn("Shared likes are unavailable.", error);
      button.title = t.likesUnavailable;
      button.disabled = !token;
    } finally {
      delete button.dataset.hydrating;
    }
  }

  function refreshLikeButtons() {
    likeButtonRegistry.forEach((recordId, button) => {
      void hydrateLike(button, recordId);
    });
  }

  function buildLikeButton(recordId, verifiedCount = 0) {
    const initialCount = lastKnownLikeCount(recordId, verifiedCount);
    const button = createElement("button", "feedback-like-button");
    button.type = "button";
    button.disabled = true;
    button.dataset.count = String(initialCount);
    button.dataset.recordId = recordId;
    button.setAttribute("aria-label", t.likeComment);
    button.setAttribute("aria-pressed", "false");
    button.innerHTML = `
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M7 10v11H3V10h4Zm4-1 3.2-6.2c.4-.8 1.4-1.1 2.2-.7.6.3.9.9.9 1.5V8h3.1c1.1 0 2 .9 2 2 0 .2 0 .4-.1.6l-2.2 8c-.2.8-1 1.4-1.9 1.4H10V9h1Z"/>
      </svg>
      <span class="feedback-like-count" aria-live="polite">${initialCount}</span>`;

    button.addEventListener("click", async () => {
      const token = voterToken();
      if (!token || button.dataset.busy === "true") return;
      const liked = button.getAttribute("aria-pressed") === "true";
      button.dataset.busy = "true";
      button.disabled = true;
      try {
        const response = await fetch(
          `${INTERACTIONS_API}/v1/comments/${encodeURIComponent(recordId)}/like`,
          {
            method: liked ? "DELETE" : "PUT",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ voterToken: token }),
          }
        );
        if (!response.ok) throw new Error("Like update failed");
        const result = await response.json();
        button.dataset.count = String(result.count || 0);
        button.setAttribute("aria-pressed", result.liked ? "true" : "false");
        button.querySelector(".feedback-like-count").textContent = String(result.count || 0);
        button.title = result.liked ? t.unlikeComment : t.likeComment;
        rememberLikeCount(recordId, result.count || 0);
      } catch (error) {
        console.warn("Shared like update failed.", error);
        button.title = t.likesUnavailable;
        void hydrateLike(button, recordId);
      } finally {
        button.dataset.busy = "false";
        button.disabled = false;
      }
    });

    likeButtonRegistry.set(button, recordId);
    hydrateLike(button, recordId);
    return button;
  }

  function buildCarouselButton(direction) {
    const isPrevious = direction === "previous";
    const label = isPrevious ? t.previousComment : t.nextComment;
    const button = createElement(
      "button",
      `feedback-carousel-arrow feedback-carousel-arrow-${isPrevious ? "previous" : "next"}`
    );
    button.type = "button";
    button.setAttribute("aria-label", label);
    button.title = label;
    button.innerHTML = `
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="${isPrevious ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"}"/>
      </svg>`;
    return button;
  }

  function buildCommentCard(record, index, total) {
    const card = createElement("article", "feedback-comment-card");
    card.dataset.commentId = record.id;
    const header = createElement("header", "feedback-comment-header");
    const identity = createElement("div", "feedback-comment-identity");
    const nameWrap = createElement("div");
    nameWrap.append(createElement("div", "feedback-comment-name", record.displayName));
    const reactions = Array.isArray(record.reactions) ? record.reactions : [];
    if (reactions.length) {
      const reactionList = createElement("div", "feedback-comment-reactions");
      reactions.forEach((value) => {
        if (!reactionLabel(value)) return;
        const pill = createElement("span", "feedback-comment-reaction");
        const art = createElement("span", "", reactionArt(value));
        art.setAttribute("aria-hidden", "true");
        pill.append(art, document.createTextNode(reactionLabel(value)));
        reactionList.append(pill);
      });
      nameWrap.append(reactionList);
    }
    identity.append(createAvatar(record), nameWrap);

    const detail = createElement("div", "feedback-comment-detail");
    const date = safeDate(record.approvedDate);
    const formattedDate = date
      ? new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-GB", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }).format(date)
      : record.approvedDate;
    const source = sourceLabel(record.source);
    const metadata = source
      ? locale === "zh"
        ? `${formattedDate} · ${t.sourcePrefix}：${source}`
        : `${formattedDate} · ${t.sourcePrefix}: ${source}`
      : formattedDate;
    detail.append(
      createElement("div", "feedback-comment-meta", metadata),
      buildLikeButton(record.id, record.likeCount)
    );
    header.append(identity, detail);

    const body = createElement("div", "feedback-comment-body");
    if (locale === "en" && record.commentEn) {
      const summaryHeading = createElement("div", "feedback-comment-language-row");
      summaryHeading.append(createElement("div", "feedback-comment-language", t.translation));
      if (record.commentEnAI === true) {
        summaryHeading.append(
          createElement("span", "feedback-ai-translation-note", t.aiTranslation)
        );
      }

      const translation = createElement(
        "p",
        "feedback-comment-translation",
        record.commentEn
      );
      const originalDetails = createElement("details", "feedback-original-details");
      const originalToggle = createElement("summary", "feedback-original-toggle");
      originalToggle.append(
        createElement("span", "feedback-original-show", t.viewOriginal),
        createElement("span", "feedback-original-hide", t.hideOriginal)
      );
      const originalPanel = createElement("div", "feedback-original-panel");
      const originalCopy = createElement("p", "feedback-original-copy", record.comment);
      originalCopy.lang = record.locale === "zh" ? "zh-Hant" : record.locale || "zh";
      originalPanel.append(originalCopy);
      originalDetails.append(originalToggle, originalPanel);
      body.append(summaryHeading, translation, originalDetails);
    } else {
      const original = createElement("p", "feedback-comment-copy", record.comment);
      original.lang = record.locale === "zh" ? "zh-Hant" : record.locale || locale;
      body.append(original);
    }

    const localPreview = ["localhost", "127.0.0.1", "::1", ""].includes(location.hostname);
    const reply =
      locale === "zh"
        ? record.authorReply || (localPreview ? t.replyPlaceholder : "")
        : record.authorReplyEn || (localPreview ? t.replyPlaceholder : "");
    if (reply) {
      const replySection = createElement("section", "feedback-author-reply");
      const replyHeading = createElement("div", "feedback-author-reply-heading");
      const authorAvatar = new Image(28, 28);
      authorAvatar.className = "feedback-author-avatar";
      authorAvatar.src = "assets/corrine-photo.jpg";
      authorAvatar.alt = "Corrine Chen";
      replyHeading.append(
        authorAvatar,
        createElement("div", "feedback-author-reply-title", t.replyTitle)
      );
      replySection.append(
        replyHeading,
        createLinkedReply(reply, record.authorReplyLink)
      );
      if (localPreview && !record.authorReply && !record.authorReplyEn) {
        replySection.dataset.placeholder = "true";
      }
      body.append(replySection);
    }

    card.append(
      header,
      body,
      createElement("div", "feedback-comment-position", t.commentPosition(index + 1, total))
    );
    return card;
  }

  function renderBoard() {
    const mount = document.querySelector("[data-feedback-board]");
    if (!mount) return;

    const approved = (Array.isArray(window.APPROVED_COMMENTS)
      ? window.APPROVED_COMMENTS.slice()
      : []
    )
      .filter(
        (record) =>
          record &&
          typeof record.id === "string" &&
          typeof record.displayName === "string" &&
          typeof record.comment === "string" &&
          typeof record.approvedDate === "string"
      )
      .sort((a, b) => a.approvedDate.localeCompare(b.approvedDate));

    if (!approved.length) {
      mount.replaceChildren(createElement("p", "feedback-board-empty", t.boardEmpty));
      return;
    }

    const carousel = createElement("div", "feedback-carousel");
    carousel.setAttribute("role", "region");
    carousel.setAttribute("aria-label", t.carouselLabel);
    if (approved.length === 1) carousel.classList.add("is-single");

    const previous = buildCarouselButton("previous");
    const next = buildCarouselButton("next");
    const viewport = createElement("div", "feedback-carousel-viewport");
    viewport.id = "feedback-comments-viewport";
    previous.setAttribute("aria-controls", viewport.id);
    next.setAttribute("aria-controls", viewport.id);

    const cards = approved.map((record, index) => {
      const card = buildCommentCard(record, index, approved.length);
      viewport.append(card);
      return card;
    });
    const liveStatus = createElement("p", "feedback-carousel-live");
    liveStatus.setAttribute("aria-live", "polite");
    liveStatus.setAttribute("aria-atomic", "true");

    let activeIndex = 0;
    function showComment(nextIndex, announce = false) {
      activeIndex = (nextIndex + cards.length) % cards.length;
      cards.forEach((card, index) => {
        const active = index === activeIndex;
        card.classList.toggle("is-active", active);
        card.setAttribute("aria-hidden", active ? "false" : "true");
      });
      if (announce) {
        liveStatus.textContent = `${approved[activeIndex].displayName}. ${t.commentPosition(
          activeIndex + 1,
          approved.length
        )}`;
      }
    }

    previous.addEventListener("click", () => showComment(activeIndex - 1, true));
    next.addEventListener("click", () => showComment(activeIndex + 1, true));
    carousel.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showComment(activeIndex - 1, true);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        showComment(activeIndex + 1, true);
      }
    });

    let touchStartX = 0;
    let touchStartY = 0;
    viewport.addEventListener(
      "touchstart",
      (event) => {
        if (event.touches.length !== 1) return;
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
      },
      { passive: true }
    );
    viewport.addEventListener(
      "touchend",
      (event) => {
        const touch = event.changedTouches[0];
        if (!touch) return;
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;
        if (Math.abs(deltaX) >= 48 && Math.abs(deltaX) > Math.abs(deltaY)) {
          showComment(activeIndex + (deltaX < 0 ? 1 : -1), true);
        }
      },
      { passive: true }
    );

    carousel.append(previous, viewport, next, liveStatus);
    mount.replaceChildren(carousel);
    showComment(activeIndex);
  }

  buildWidget();
  renderBoard();
  window.addEventListener("online", refreshLikeButtons);
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) refreshLikeButtons();
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) refreshLikeButtons();
  });
})();

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const source = fs.readFileSync(
  path.join(__dirname, "..", "approved-comments-data.js"),
  "utf8"
);

function approvedComments() {
  const context = vm.createContext({ window: {} });
  vm.runInContext(source, context);
  return context.window.APPROVED_COMMENTS;
}

test("Kevin's bilingual author reply includes the approved Xiaohongshu profile", () => {
  const kevin = approvedComments().find(
    (comment) => comment.id === "kevin-2026-08-01"
  );

  assert.ok(kevin);
  assert.equal(
    kevin.authorReply,
    "谢谢 K 老师的留言！Kevin 是我身边朋友中第一批的 AI 先行者。在刚刚开始探索 AI 的时候，我受到了K老师很多的启发和帮助。另外，K 老师还是一位越野跑大神呢！Respect~ 欢迎大家关注他的小红书：西瓜岛的凯文"
  );
  assert.equal(
    kevin.authorReplyEn,
    "Thank you for your lovely comment, K! Kevin was one of the earliest AI adopters among my friends. When I first started exploring AI, he gave me a great deal of inspiration and support. He is also an amazing trail runner. Much respect! You’re welcome to follow him on Xiaohongshu: 西瓜岛的凯文"
  );
  assert.equal(kevin.authorReplyLink?.text, "西瓜岛的凯文");
  assert.equal(
    kevin.authorReplyLink?.href,
    "https://www.xiaohongshu.com/user/profile/5a222a28e8ac2b7436bf58f3?xsec_token=YB6U1PQEDkZXpb660jdidjEapHCsmxJ6nFxRv-Ey5zpog=&xsec_source=app_share&xhsshare=CopyLink&shareRedId=N0c0MjVGNkFLP0ZFO0o3Ojk5S005PUw8&apptime=1785765606&share_id=106a69d4eab34aae80eeb35747d9f5f8&wechatWid=53eab4cd4396098ada43fe4d5413aa33&wechatOrigin=menu"
  );
});

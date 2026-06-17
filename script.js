const form = document.querySelector("#generator-form");
const output = document.querySelector("#output");
const toast = document.querySelector("#toast");
const insightStrip = document.querySelector("#insight-strip");

const fields = {
  storeType: document.querySelector("#storeType"),
  storeName: document.querySelector("#storeName"),
  audience: document.querySelector("#audience"),
  campaign: document.querySelector("#campaign"),
  platform: document.querySelector("#platform"),
  tone: document.querySelector("#tone"),
};

let latestText = "";

const toneMap = {
  自然亲切: "像店主本人发的内容，少一点广告味，多一点真实感",
  清爽专业: "信息清楚，规则明确，适合放在点评平台或社群里",
  校园感强: "贴近下课、宿舍、考试周这些场景，方便学生理解",
  促销感强: "突出优惠、时间限制和到店动作，但不写得太夸张",
};

const storeIdeas = {
  奶茶店: ["新品口味", "下课顺路", "第二杯分享"],
  饭店: ["晚餐套餐", "宿舍拼单", "到店热菜"],
  理发店: ["开学换发型", "形象整理", "学生剪发"],
  健身房: ["体验课", "体测计划", "低门槛训练"],
  水果店: ["当季水果", "宿舍果切", "健康加餐"],
  打印店: ["论文打印", "资料装订", "加急服务"],
};

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 1800);
}

function getFormData() {
  const storeType = fields.storeType.value.trim();
  return {
    storeType,
    storeName: fields.storeName.value.trim() || `校园${storeType}`,
    audience: fields.audience.value.trim(),
    campaign: fields.campaign.value.trim() || "本周到店专属优惠",
    platform: fields.platform.value.trim(),
    tone: fields.tone.value.trim(),
  };
}

function makePlan(data) {
  const ideas = storeIdeas[data.storeType] || ["本周活动", "到店体验", "老客推荐"];
  const toneHint = toneMap[data.tone] || toneMap.自然亲切;

  const titles = [
    `${data.storeName}这次活动，适合${data.audience}下课顺路安排`,
    `${ideas[0]} + ${data.campaign}，学校附近这家${data.storeType}可以看看`,
    `预算不高也能有点小惊喜：${data.storeName}给${data.audience}的今日活动`,
  ];

  const post = `今天给附近的${data.audience}准备了一个小活动：${data.campaign}。\n\n如果你刚好在学校附近，想找一家方便、价格清楚、体验稳定的${data.storeType}，可以来${data.storeName}看看。建议和同学一起到店，选择更灵活，也更适合顺手分享。\n\n活动规则以门店当天说明为准，想先确认时间或细节，可以直接私信。`;

  const video = `镜头 1：拍门头或招牌，字幕写“学校附近的${data.storeType}，今天有个适合${data.audience}的小活动”。\n镜头 2：展示${ideas[0]}、店内环境、活动价签或制作过程，穿插顾客到店/咨询的自然画面。\n口播：如果你最近在找方便一点的${data.storeType}，可以看看${data.storeName}。今天主推${data.campaign}，适合下课、下班或周末顺路来。\n结尾：想了解活动规则，可以评论“活动”或直接私信，我们把时间和参与方式发给你。`;

  const replies = [
    `您好，${data.storeName}今天的活动是“${data.campaign}”，具体时间和规则以到店说明为准，也可以先私信确认。`,
    `可以的，这个活动比较适合${data.audience}。如果不确定怎么选，可以告诉我们人数和预算，我们帮您推荐。`,
    `感谢关注，我们就在学校附近。价格、营业时间和活动细节都可以直接留言咨询，我们看到后会尽快回复。`,
  ];

  const advice = `建议今天优先在${data.platform}发布一条${data.tone}风格内容，重点突出“${data.campaign}”和“适合${data.audience}”。线下海报同步写清活动时间、参与规则和私信关键词，减少重复解释成本。`;

  return { titles, post, video, replies, advice, toneHint };
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return map[char];
  });
}

function renderList(items) {
  return `<ol>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>`;
}

function renderCard(title, content, type = "text") {
  const safeContent = type === "list" ? renderList(content) : escapeHtml(content);
  const plainText = Array.isArray(content) ? content.map((item, index) => `${index + 1}. ${item}`).join("\n") : content;

  return `
    <section class="result-card">
      <header>
        <h4>${title}</h4>
        <button class="copy-btn" type="button" data-copy="${escapeHtml(plainText)}">复制</button>
      </header>
      <div class="content">${safeContent}</div>
    </section>
  `;
}

function renderOutput(plan, data) {
  latestText = [
    "AI 运营包",
    `门店：${data.storeName}`,
    `策略：${plan.toneHint}`,
    "",
    "小红书标题：",
    ...plan.titles.map((item, index) => `${index + 1}. ${item}`),
    "",
    "发布文案：",
    plan.post,
    "",
    "短视频脚本：",
    plan.video,
    "",
    "顾客回复话术：",
    ...plan.replies.map((item, index) => `${index + 1}. ${item}`),
    "",
    "今日执行建议：",
    plan.advice,
  ].join("\n");

  insightStrip.innerHTML = [
    `策略：${escapeHtml(plan.toneHint)}`,
    `主平台：${escapeHtml(data.platform)}`,
    `目标客群：${escapeHtml(data.audience)}`,
  ].map((item) => `<span>${item}</span>`).join("");

  output.className = "";
  output.innerHTML = [
    renderCard("小红书标题 3 条", plan.titles, "list"),
    renderCard("发布文案 1 条", plan.post),
    renderCard("短视频脚本 1 条", plan.video),
    renderCard("顾客回复话术 3 条", plan.replies, "list"),
    renderCard("今日执行建议 1 条", plan.advice),
  ].join("");
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast("已复制到剪贴板");
  } catch (error) {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    document.body.removeChild(area);
    showToast("已复制到剪贴板");
  }
}

function fillDemo() {
  fields.storeType.value = "奶茶店";
  fields.storeName.value = "满杯日记";
  fields.audience.value = "大学生";
  fields.campaign.value = "新品桂花乌龙第二杯半价，下午 2 点到 6 点可用";
  fields.platform.value = "小红书";
  fields.tone.value = "自然亲切";

  const data = getFormData();
  renderOutput(makePlan(data), data);
  showToast("已填入奶茶店新品活动示例");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = getFormData();
  renderOutput(makePlan(data), data);
  showToast("已生成运营包");
});

document.addEventListener("click", (event) => {
  const copyButton = event.target.closest("[data-copy]");
  if (copyButton) {
    copyText(copyButton.dataset.copy);
  }

  if (event.target.closest("[data-copy-all]")) {
    if (!latestText) {
      showToast("请先生成运营包");
      return;
    }
    copyText(latestText);
  }

  if (event.target.closest("[data-fill-demo]")) {
    fillDemo();
  }
});

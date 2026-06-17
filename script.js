(function () {
  "use strict";

  const HISTORY_KEY = "campusbiz-history-v1";
  let latestPackageText = "";
  let latestCalendarText = "";

  const examples = {
    tea: {
      storeType: "奶茶店",
      storeName: "满杯日记",
      priceRange: "10-20 元",
      audience: "大学生",
      channel: "小红书",
      goal: "推新品",
      campaign: "新品桂花乌龙第二杯半价，下午 2 点到 6 点可用",
      tone: "亲切",
    },
    dinner: {
      storeType: "饭店",
      storeName: "南门小馆",
      priceRange: "20-40 元",
      audience: "情侣",
      channel: "朋友圈",
      goal: "复购",
      campaign: "周末双人套餐 68 元，含两份主食、一份小吃和两杯饮品",
      tone: "专业",
    },
    print: {
      storeType: "打印店",
      storeName: "启航打印",
      priceRange: "10 元以下",
      audience: "考研学生",
      channel: "线下海报",
      goal: "节日活动",
      campaign: "开学季资料打印满 20 元减 3 元，论文装订可加急",
      tone: "亲切",
    },
  };

  const caseData = [
    ["餐饮", "奶茶店新品第二杯半价", "校门口奶茶店，新品上架但线上表达不稳定。", "推新品", "奶茶店 / 大学生 / 第二杯半价", "标题、朋友圈文案和短视频脚本。", "小红书 / 朋友圈", "先发新品口味，再补一条到店提醒。", "不要暗示所有门店通用，写清时间和规则。"],
    ["餐饮", "饭店周末双人套餐", "校园附近小饭店，周末晚餐时段希望增加到店。", "提升周末到店", "饭店 / 情侣 / 双人套餐", "套餐卖点、朋友圈文案和点评平台介绍。", "朋友圈 / 美团点评", "把价格、菜品和可用时间写清楚。", "套餐内容变化时要及时更新。"],
    ["生活服务", "理发店开学季剪发优惠", "理发店想抓住开学季换发型需求。", "拉新", "理发店 / 大学生 / 学生剪发", "短视频脚本、活动文案和咨询回复。", "抖音 / 朋友圈", "展示环境和发型案例，降低第一次到店顾虑。", "不要承诺每个人都能达到同样效果。"],
    ["校园刚需", "打印店论文打印装订", "打印店高峰期重复咨询多。", "减少重复解释", "打印店 / 考研学生 / 装订优惠", "价格说明、私信回复和海报文案。", "微信群 / 线下海报", "把营业时间、加急规则和价格范围写清楚。", "价格如有浮动，需要提示以店内为准。"],
    ["健身健康", "健身房体验课活动", "校园附近健身房希望吸引低门槛体验。", "拉新", "健身房 / 大学生 / 体验课", "体验课介绍、短视频脚本和回复话术。", "小红书 / 抖音", "强调体验流程和适合新手，不做夸张承诺。", "避免保证减脂、塑形等未经验证效果。"],
    ["餐饮", "水果店宿舍拼团活动", "水果店希望提升宿舍场景购买。", "复购", "水果店 / 宿舍党 / 果切拼团", "拼团文案、社群话术和发布时间建议。", "微信群 / 朋友圈", "按宿舍场景写份量、配送和截单时间。", "写清保存方式和配送范围。"],
  ];

  function init() {
    setupNavigation();
    setupPrintButtons();
    setupHomeGenerator();
    setupHistory();
    setupCalendar();
    setupReply();
    setupCases();
  }

  function $(selector, root = document) {
    return root.querySelector(selector);
  }

  function $all(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function showToast(message) {
    let toast = $("#toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toast";
      toast.className = "toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }
    safeSetText(toast, message);
    toast.classList.add("show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 1800);
  }

  function safeSetText(node, value) {
    if (node) node.textContent = value == null ? "" : String(value);
  }

  function getValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
  }

  function setValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value;
  }

  function clearNode(node) {
    if (!node) return;
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function createEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function isStorageAvailable() {
    try {
      const key = "__campusbiz_test__";
      window.localStorage.setItem(key, key);
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  }

  async function copyText(text) {
    if (!text) {
      showToast("暂无可复制内容");
      return;
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        showToast("已复制到剪贴板");
        return;
      }
      throw new Error("clipboard unavailable");
    } catch (error) {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand && document.execCommand("copy");
      document.body.removeChild(area);
      showToast(ok ? "已复制到剪贴板" : "复制不可用，请手动选择文本");
    }
  }

  function downloadText(filename, text) {
    if (!text) {
      showToast("暂无可下载内容");
      return;
    }
    try {
      if (!window.Blob || !window.URL || !URL.createObjectURL) throw new Error("download unavailable");
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast("TXT 文件已生成");
    } catch (error) {
      copyText(text);
      showToast("下载不可用，已尝试复制文本");
    }
  }

  function setupNavigation() {
    const current = document.body.dataset.page;
    $all(".nav-links a").forEach((link) => {
      if (link.dataset.page === current) link.classList.add("active");
    });
  }

  function setupPrintButtons() {
    document.addEventListener("click", (event) => {
      const printTarget = event.target.closest("[data-print]");
      if (printTarget) {
        if (typeof window.print === "function") {
          window.print();
        } else {
          showToast("当前浏览器不支持打印，请使用浏览器菜单打印");
        }
      }
    });
  }

  function setupHomeGenerator() {
    const form = $("#generator-form");
    if (!form) return;

    $all("[data-example]").forEach((button) => {
      button.addEventListener("click", () => fillExample(button.dataset.example));
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = readHomeForm();
      if (!validateHomeForm(data)) return;
      const output = $("#output");
      if (output) {
        output.className = "loading-state";
        output.textContent = "正在生成运营建议...";
      }
      window.setTimeout(() => {
        const pkg = generateContentPackage(data);
        renderContentPackage(pkg);
        saveHistory(pkg);
        const result = $("#result-section");
        if (result && result.scrollIntoView) result.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 420);
    });

    document.addEventListener("click", (event) => {
      const copyButton = event.target.closest("[data-copy-text]");
      if (copyButton) copyText(copyButton.dataset.copyText);

      if (event.target.closest("[data-copy-package]")) copyText(latestPackageText);

      if (event.target.closest("[data-download-package]")) {
        const name = getValue("storeName") || "campusbiz";
        downloadText(`${sanitizeFileName(name)}-${dateStamp()}.txt`, latestPackageText);
      }

      if (event.target.closest("[data-save-history]")) {
        const data = readHomeForm();
        if (validateHomeForm(data, false)) {
          const pkg = generateContentPackage(data);
          saveHistory(pkg);
        }
      }
    });

    renderHistory();
  }

  function readHomeForm() {
    return {
      storeType: getValue("storeType"),
      storeName: getValue("storeName"),
      priceRange: getValue("priceRange"),
      audience: getValue("audience"),
      channel: getValue("channel"),
      goal: getValue("goal"),
      campaign: getValue("campaign"),
      tone: getValue("tone"),
    };
  }

  function validateHomeForm(data, focus = true) {
    setError("storeNameError", "");
    setError("campaignError", "");
    const alert = $("#formAlert");
    if (alert) alert.classList.remove("show");
    if (!data.storeName) {
      setError("storeNameError", "请填写店铺名称，方便生成更贴近门店的内容。");
      showFormAlert("还有信息未填写，请先补充店铺名称。");
      if (focus) $("#storeName")?.focus();
      return false;
    }
    if (!data.campaign) {
      setError("campaignError", "请填写活动内容，例如优惠规则、时间或主推产品。");
      showFormAlert("还有信息未填写，请先补充活动内容。");
      if (focus) $("#campaign")?.focus();
      return false;
    }
    return true;
  }

  function setError(id, message) {
    const el = document.getElementById(id);
    if (el) el.textContent = message;
  }

  function showFormAlert(message) {
    const alert = $("#formAlert");
    if (!alert) return;
    alert.textContent = message;
    alert.classList.add("show");
  }

  function fillExample(key) {
    const data = examples[key] || examples.tea;
    Object.keys(data).forEach((field) => setValue(field, data[field]));
    const flag = $("#exampleFlag");
    if (flag) {
      flag.textContent = "当前为示例数据，用于演示 MVP 流程。";
      flag.classList.add("show");
    }
    showToast("已填充示例数据");
  }

  function generateContentPackage(data) {
    const profile = `${data.audience}，客单价${data.priceRange}，主要通过${data.channel}触达顾客`;
    const platform = recommendPlatform(data);
    const theme = `${data.storeName}${data.goal}活动：${data.campaign}`;
    const blocks = [
      ["内容说明", "以下为模拟数据，由前端规则生成，用于演示静态 MVP 流程。正式使用前建议结合门店真实情况人工检查。"],
      ["活动主题", theme],
      ["活动目标判断", `本次更适合围绕“${data.goal}”设计内容，重点把活动规则讲清楚，并引导顾客咨询或到店。`],
      ["用户画像判断", `${data.storeType}的主要客群是${profile}。内容应少用复杂术语，突出到店场景、价格感知和参与方式。`],
      ["推荐平台", `建议优先使用${platform}。如果门店已有稳定私域，也可以同步发到朋友圈或社群。`],
      ["A/B 两版朋友圈文案", `A 版：${data.storeName}这周准备了一个小活动：${data.campaign}。如果你刚好在附近，可以顺路来看看，活动规则以门店当天说明为准。\n\nB 版：给附近的${data.audience}做了一个${data.goal}活动，主推${data.campaign}。想先确认时间或细节，可以直接私信，我们会尽快回复。`],
      ["小红书标题 3 条", `1. 学校附近这家${data.storeType}，这周活动可以看看\n2. ${data.storeName}的${data.goal}活动：${data.campaign}\n3. 适合${data.audience}顺路安排的小店活动`],
      ["抖音短视频脚本", `开头：镜头拍门头或主推产品，字幕写“学校附近的${data.storeType}，这周有个小活动”。\n画面：展示产品、店内环境、活动价签和顾客自然咨询画面。\n口播：如果你最近在找方便一点的${data.storeType}，可以看看${data.storeName}，本次活动是${data.campaign}。\n结尾引导：想了解活动规则，可以评论“活动”或直接私信。`],
      ["美团/大众点评活动介绍", `${data.storeName}近期活动：${data.campaign}。适合${data.audience}到店体验，具体参与时间、价格和规则以门店说明为准。建议提前咨询，避免高峰期等待。`],
      ["顾客评论/私信回复话术 3 条", `1. 您好，本次活动是“${data.campaign}”，具体规则以门店当天说明为准。\n2. 可以的，如果您不确定怎么选，可以告诉我们人数和预算，我们帮您推荐。\n3. 感谢关注，我们在学校附近，营业时间和活动细节都可以直接留言咨询。`],
      ["推荐发布时间", recommendTime(data)],
      ["内容风险提醒", "活动时间、适用范围、价格和参与条件需要写清楚；不要承诺无法保证的效果；如涉及库存或名额，应注明以门店实际情况为准。"],
      ["一句话复盘建议", "发布后记录顾客最常问的问题、被复制最多的文案和实际到店反馈，用于优化下一轮活动。"],
    ];

    return {
      id: String(Date.now()),
      createdAt: new Date().toLocaleString("zh-CN"),
      data,
      blocks,
    };
  }

  function recommendPlatform(data) {
    if (data.goal === "提升评价") return "美团/大众点评";
    if (data.channel === "抖音") return "抖音短视频";
    if (data.channel === "小红书") return "小红书";
    if (data.audience === "宿舍党") return "朋友圈 / 社群";
    return `${data.channel} / 朋友圈`;
  }

  function recommendTime(data) {
    if (data.storeType === "饭店") return "建议 10:30-11:30 或 16:30-17:30 发布，贴近用餐决策时间。";
    if (data.storeType === "奶茶店") return "建议 13:00-15:00 发布，承接下午茶和下课场景。";
    if (data.storeType === "打印店") return "建议 9:00-10:00 或 20:00-22:00 发布，贴近资料准备时间。";
    return "建议选择顾客做决策前 1-2 小时发布，并连续观察咨询高峰。";
  }

  function renderContentPackage(pkg) {
    const output = $("#output");
    if (!output) return;
    clearNode(output);
    output.className = "";
    latestPackageText = packageToText(pkg);
    pkg.blocks.forEach(([title, content]) => {
      output.appendChild(resultCard(title, content));
    });
    renderHistory();
  }

  function resultCard(title, content) {
    const card = createEl("section", "result-card");
    const header = createEl("header");
    const h = createEl("h3", "", title);
    const button = createEl("button", "copy-btn", "复制");
    button.type = "button";
    button.dataset.copyText = content;
    const body = createEl("div", "content", content);
    header.append(h, button);
    card.append(header, body);
    return card;
  }

  function packageToText(pkg) {
    const lines = [`CampusBiz AI 运营内容包`, `店铺：${pkg.data.storeName}`, `类型：${pkg.data.storeType}`, `活动目标：${pkg.data.goal}`, `生成时间：${pkg.createdAt}`, ""];
    pkg.blocks.forEach(([title, content]) => {
      lines.push(`【${title}】`, content, "");
    });
    return lines.join("\n");
  }

  function saveHistory(pkg) {
    const notice = $("#historyNotice");
    if (!isStorageAvailable()) {
      if (notice) notice.textContent = "当前浏览器不支持本地历史记录。";
      return;
    }
    const list = readHistory();
    const exists = list.some((item) => item.id === pkg.id);
    const next = exists ? list : [pkg, ...list].slice(0, 5);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    renderHistory();
    showToast("已保存到历史记录");
  }

  function readHistory() {
    if (!isStorageAvailable()) return [];
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    } catch (error) {
      return [];
    }
  }

  function renderHistory() {
    const box = $("#historyList");
    if (!box) return;
    clearNode(box);
    const notice = $("#historyNotice");
    if (!isStorageAvailable()) {
      if (notice) notice.textContent = "当前浏览器不支持本地历史记录。";
      box.appendChild(createEl("div", "empty-state", "历史记录不可用，但不影响生成和复制功能。"));
      return;
    }
    if (notice) notice.textContent = "";
    const list = readHistory();
    if (!list.length) {
      box.appendChild(createEl("div", "empty-state", "暂无历史记录。生成运营包后，可以保存最近 5 条。"));
      return;
    }
    list.forEach((item) => {
      const row = createEl("div", "history-item");
      const info = createEl("div");
      info.append(
        createEl("strong", "", `${item.data.storeName} · ${item.data.storeType}`),
        createEl("p", "", `活动目标：${item.data.goal}`),
        createEl("p", "", `活动内容：${item.data.campaign}`),
        createEl("p", "", `生成时间：${item.createdAt}`)
      );
      const actions = createEl("div", "actions");
      const view = createEl("button", "secondary-btn", "查看");
      view.type = "button";
      view.addEventListener("click", () => renderContentPackage(item));
      const del = createEl("button", "danger-btn", "删除");
      del.type = "button";
      del.addEventListener("click", () => deleteHistory(item.id));
      actions.append(view, del);
      row.append(info, actions);
      box.appendChild(row);
    });
  }

  function deleteHistory(id) {
    if (!isStorageAvailable()) return;
    const next = readHistory().filter((item) => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    renderHistory();
    showToast("已删除历史记录");
  }

  function clearHistory() {
    if (!isStorageAvailable()) return;
    localStorage.removeItem(HISTORY_KEY);
    renderHistory();
    showToast("历史记录已清空");
  }

  function setupHistory() {
    const clear = $("#clearHistory");
    if (clear) clear.addEventListener("click", clearHistory);
  }

  function setupCalendar() {
    const form = $("#calendar-form");
    if (!form) return;
    $all("[data-calendar-example]").forEach((button) => {
      button.addEventListener("click", () => fillCalendarExample(button.dataset.calendarExample));
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = {
        storeType: getValue("calendarStoreType"),
        goal: getValue("calendarGoal"),
        product: getValue("calendarProduct"),
        frequency: getValue("calendarFrequency"),
        weekend: getValue("calendarWeekend"),
      };
      const error = $("#calendarError");
      if (!data.product) {
        if (error) error.textContent = "请填写本周主推产品或活动。";
        return;
      }
      if (error) error.textContent = "";
      const plan = generateCalendarPlan(data);
      renderCalendarPlan(plan);
    });
    document.addEventListener("click", (event) => {
      if (event.target.closest("[data-copy-calendar]")) copyText(latestCalendarText);
      if (event.target.closest("[data-download-calendar]")) downloadText(`campusbiz-calendar-${dateStamp()}.txt`, latestCalendarText);
    });
  }

  function fillCalendarExample(key) {
    const map = {
      tea: ["奶茶店", "推新品", "桂花乌龙新品周", "中频", "是"],
      dinner: ["饭店", "复购", "周末双人套餐", "中频", "是"],
      print: ["打印店", "拉新", "开学季资料打印装订", "高频", "否"],
    };
    const data = map[key] || map.tea;
    ["calendarStoreType", "calendarGoal", "calendarProduct", "calendarFrequency", "calendarWeekend"].forEach((id, index) => setValue(id, data[index]));
    showToast("已填充示例数据");
  }

  function generateCalendarPlan(data) {
    const days = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
    const platforms = ["朋友圈", "小红书", "社群", "抖音", "美团/大众点评", "朋友圈", "小红书"];
    return days.map((day, index) => ({
      day,
      platform: platforms[index],
      theme: `${data.product} · ${data.goal}`,
      format: index % 3 === 0 ? "短文案 + 图片" : index % 3 === 1 ? "标题种草" : "短视频脚本",
      copy: `${day}围绕${data.storeType}的${data.product}做一次轻量触达，强调规则清楚、到店方便。`,
      action: index >= 5 && data.weekend === "是" ? "强化周末活动提醒，写清可用时间。" : "记录顾客咨询问题，作为下一条内容素材。",
      time: index % 2 === 0 ? "15-20 分钟" : "20-30 分钟",
    }));
  }

  function renderCalendarPlan(plan) {
    const box = $("#calendarOutput");
    if (!box) return;
    clearNode(box);
    latestCalendarText = plan.map((item) => `${item.day}\n平台：${item.platform}\n主题：${item.theme}\n形式：${item.format}\n方向：${item.copy}\n建议：${item.action}\n准备时间：${item.time}`).join("\n\n");
    plan.forEach((item) => {
      box.appendChild(resultCard(`${item.day} · ${item.platform}`, `内容主题：${item.theme}\n内容形式：${item.format}\n示例文案方向：${item.copy}\n执行建议：${item.action}\n预计准备时间：${item.time}`));
    });
  }

  function setupReply() {
    const form = $("#reply-form");
    if (!form) return;
    $all("[data-reply-example]").forEach((button) => {
      button.addEventListener("click", () => setValue("customerComment", button.dataset.replyExample));
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const comment = getValue("customerComment");
      const error = $("#replyError");
      if (!comment) {
        if (error) error.textContent = "请先输入顾客评论或咨询内容。";
        return;
      }
      if (error) error.textContent = "";
      renderReply(generateReply({ comment, type: getValue("commentType"), tone: getValue("replyTone") }));
    });
  }

  function generateReply(data) {
    const isBad = data.type === "差评";
    return {
      short: isBad ? "不好意思给您带来不好的体验了，我们会先核实具体情况，再尽快给您一个处理方案。" : "您好，感谢您的关注，我们把活动信息整理给您，方便您确认。",
      detail: isBad ? `您好，看到您的反馈我们很重视。关于“${data.comment}”，建议先向顾客表达歉意，再询问具体时间、订单或到店情况，避免直接争辩。` : `您好，关于“${data.comment}”，可以先说明规则、时间或价格，再引导顾客私信确认细节。`,
      repurchase: isBad ? "如果后续问题处理清楚，可以再邀请顾客到店体验，但不要在未核实前承诺补偿。" : "如果您这次体验合适，也欢迎关注本周活动，我们会持续更新门店优惠和新品信息。",
      risk: isBad ? "差评需要先安抚再解决，不推卸责任，不承诺无法保证的补偿，必要时人工跟进。" : "回复时要写清规则和限制，避免让顾客误解活动范围。",
      human: isBad ? "建议人工处理" : data.type.includes("咨询") ? "一般可模板回复，复杂问题再人工跟进" : "可先模板回复",
    };
  }

  function renderReply(reply) {
    const box = $("#replyOutput");
    if (!box) return;
    clearNode(box);
    [
      ["简短回复", reply.short],
      ["详细回复", reply.detail],
      ["引导复购回复", reply.repurchase],
      ["风险提醒", reply.risk],
      ["是否建议人工处理", reply.human],
    ].forEach(([title, content]) => box.appendChild(resultCard(title, content)));
  }

  function setupCases() {
    const box = $("#caseList");
    if (!box) return;
    renderCases("全部");
    $all("[data-case-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        $all("[data-case-filter]").forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        filterCases(button.dataset.caseFilter);
      });
    });
  }

  function filterCases(filter) {
    renderCases(filter);
  }

  function renderCases(filter) {
    const box = $("#caseList");
    if (!box) return;
    clearNode(box);
    const list = filter === "全部" ? caseData : caseData.filter((item) => item[0] === filter);
    if (!list.length) {
      box.appendChild(createEl("div", "empty-state", "暂无匹配案例。"));
      return;
    }
    list.forEach((item) => {
      const card = createEl("article", "card case-card");
      card.append(
        createEl("span", "tag", `示例数据 · ${item[0]}`),
        createEl("h3", "", item[1]),
        createEl("p", "", `商家背景：${item[2]}`),
        createEl("p", "", `活动目标：${item[3]}`),
        createEl("p", "", `输入信息：${item[4]}`),
        createEl("p", "", `AI 生成内容摘要：${item[5]}`),
        createEl("p", "", `推荐平台：${item[6]}`),
        createEl("p", "", `使用建议：${item[7]}`),
        createEl("p", "", `风险提醒：${item[8]}`)
      );
      box.appendChild(card);
    });
  }

  function sanitizeFileName(value) {
    return value.replace(/[\\/:*?"<>|\s]+/g, "-").slice(0, 40) || "campusbiz";
  }

  function dateStamp() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  }

  document.addEventListener("DOMContentLoaded", init);

  window.CampusBiz = {
    init,
    showToast,
    copyText,
    downloadText,
    safeSetText,
    saveHistory,
    renderHistory,
    clearHistory,
    generateContentPackage,
    renderContentPackage,
    generateCalendarPlan,
    renderCalendarPlan,
    generateReply,
    renderReply,
    filterCases,
    setupNavigation,
    setupPrintButtons,
  };
})();

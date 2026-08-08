const defaultWatchlist = ["宝钢股份 · 600019", "钢铁行业"];
let watchlist = JSON.parse(localStorage.getItem("qingyun-watchlist") || "null") || defaultWatchlist;

const researchData = {
  baosteel: {
    name: "宝钢股份",
    code: "600019",
    facts: ["2025 年营收约 3,175.1 亿元，归母净利润约 103.5 亿元。", "2026 年一季度营收同比 +5.7%，归母净利润同比 −8.6%。"],
    questions: ["收入增长、利润下降的具体原因是什么？", "钢材售价与原燃料成本差额如何变化？", "高附加值产品结构是否改善？"],
    risks: ["钢铁行业需求与产品价格波动", "铁矿石、焦煤等原料成本波动", "新一期财报可能改变当前理解"],
    sources: [
      ["2026 年第一季度报告", "https://static.cninfo.com.cn/finalpage/2026-04-30/1225257456.PDF"],
      ["2025 年年度报告", "https://vip.stock.finance.sina.com.cn/corp/view/vCB_AllBulletinDetail.php?id=12277876&stockid=600019"]
    ]
  }
};

function findResearch(query) {
  const normalized = query.trim().toLowerCase().replace(/\s/g, "");
  return ["600019", "宝钢", "宝钢股份", "baosteel"].some(key => normalized.includes(key)) ? researchData.baosteel : null;
}

function renderResearch(query) {
  const container = document.querySelector("#research-result");
  const data = findResearch(query);
  if (data) {
    container.innerHTML = `<article class="research-card"><div class="research-card-head"><div><h3>${data.name} <small>· ${data.code} · A 股</small></h3><p class="form-note">研究卡版本：2026.08.08 · 数据以所列公开披露为准</p></div><span class="status">已收录</span></div><div class="research-grid"><section><h4>已确认事实</h4><ul>${data.facts.map(item => `<li>${item}</li>`).join("")}</ul></section><section><h4>待核验问题</h4><ul>${data.questions.map(item => `<li>${item}</li>`).join("")}</ul></section><section><h4>主要风险</h4><ul>${data.risks.map(item => `<li>${item}</li>`).join("")}</ul></section></div><div class="source-links">公开来源：${data.sources.map(([name, url]) => `<a href="${url}" target="_blank" rel="noopener">${name}</a>`).join("　")}</div></article>`;
  } else {
    const safeQuery = query.replace(/[<>]/g, "");
    container.innerHTML = `<article class="research-card"><div class="research-card-head"><div><h3>${safeQuery} <small>· 研究任务已创建</small></h3><p class="form-note">该对象尚未收录结构化资料；请先核验公司全称和证券代码。</p></div><span class="status">待收录</span></div><div class="research-grid"><section><h4>第 1 步：原始披露</h4><p>查找最新年报、季报、临时公告和投资者关系页面。</p></section><section><h4>第 2 步：四个问题</h4><p>公司靠什么赚钱？收入和利润如何变化？成本关键是什么？什么事实会推翻判断？</p></section><section><h4>第 3 步：记录来源</h4><p>在“公告与更新”页写下链接、日期、事实摘要和自己的待核验问题。</p></section></div><div class="source-links">建议优先使用：<a href="https://www.cninfo.com.cn/" target="_blank" rel="noopener">巨潮资讯</a>　<a href="https://www.sse.com.cn/" target="_blank" rel="noopener">上海证券交易所</a></div></article>`;
  }
  container.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function renderWatchlist() {
  const list = document.querySelector("#watchlist");
  const count = document.querySelector("#watch-count");
  if (!list || !count) return;
  list.innerHTML = "";
  watchlist.forEach((name, index) => {
    const item = document.createElement("div");
    item.className = "watch-item";
    item.innerHTML = `<button class="watch-name" type="button">${name}</button><button class="remove-watch" type="button" aria-label="删除 ${name}">×</button>`;
    item.querySelector(".watch-name").addEventListener("click", () => renderResearch(name));
    item.querySelector(".remove-watch").addEventListener("click", () => { watchlist.splice(index, 1); saveWatchlist(); });
    list.appendChild(item);
  });
  count.textContent = `${watchlist.length} 项`;
}

function saveWatchlist() {
  localStorage.setItem("qingyun-watchlist", JSON.stringify(watchlist));
  renderWatchlist();
}

document.querySelector("#research-form")?.addEventListener("submit", event => {
  event.preventDefault();
  const input = document.querySelector("#query");
  const query = input.value.trim();
  if (query) renderResearch(query);
});

document.querySelector("#watch-form")?.addEventListener("submit", event => {
  event.preventDefault();
  const input = document.querySelector("#ticker");
  const name = input.value.trim();
  if (name && !watchlist.includes(name)) { watchlist.push(name); saveWatchlist(); }
  input.value = "";
});

const prefilled = new URLSearchParams(window.location.search).get("q");
if (prefilled) renderResearch(prefilled);
renderWatchlist();

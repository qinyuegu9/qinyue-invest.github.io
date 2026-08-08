const defaultWatchlist = ["宝钢股份 · 600019", "钢铁行业", "待观察公司"];
const saved = JSON.parse(localStorage.getItem("vision-watchlist") || "null");
let watchlist = Array.isArray(saved) ? saved : defaultWatchlist;

const list = document.querySelector("#watchlist");
const count = document.querySelector("#watch-count");

function renderWatchlist() {
  list.innerHTML = "";
  watchlist.forEach((name, index) => {
    const item = document.createElement("div");
    item.className = "watch-item";
    item.innerHTML = `<span>${name}</span><button type="button" aria-label="删除 ${name}">×</button>`;
    item.querySelector("button").addEventListener("click", () => {
      watchlist.splice(index, 1);
      saveAndRender();
    });
    list.appendChild(item);
  });
  count.textContent = `${watchlist.length} 项`;
}

function saveAndRender() {
  localStorage.setItem("vision-watchlist", JSON.stringify(watchlist));
  renderWatchlist();
}

document.querySelector("#watch-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector("#ticker");
  const name = input.value.trim();
  if (name && !watchlist.includes(name)) {
    watchlist.push(name);
    saveAndRender();
  }
  input.value = "";
});

document.querySelector("#copy-template").addEventListener("click", async () => {
  const template = `研究对象：\n\n核心假设：\n\n支持证据（附原始链接）：\n\n待验证证据：\n\n关键风险 / 推翻条件：\n\n乐观、基准、保守情景及前提：\n\n复盘日期：`;
  try {
    await navigator.clipboard.writeText(template);
    const button = document.querySelector("#copy-template");
    button.textContent = "已复制，可粘贴到笔记中";
    setTimeout(() => { button.textContent = "复制研究模板"; }, 1800);
  } catch {
    alert(template);
  }
});

renderWatchlist();

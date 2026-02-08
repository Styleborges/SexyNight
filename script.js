const TAB_TITLES = {
  photos: "Fotos",
  shorts: "Shorts",
  free: "Freezão",
  premium: "Night Premium",
};

let currentTab = "photos";
let catalog = { photos: [], shorts: [], free: [], premium: [] };

/** Gate Premium (placeholder) */
let premiumUnlocked = false;
const PREMIUM_CODE = "1234"; // troque por um código seu

const grid = document.getElementById("grid");
const empty = document.getElementById("empty");
const title = document.getElementById("title");
const statusEl = document.getElementById("status");
const tabLabel = document.getElementById("tabLabel");
const shown = document.getElementById("shown");
const total = document.getElementById("total");
const search = document.getElementById("search");
const clear = document.getElementById("clear");
const reloadBtn = document.getElementById("reload");
const errorBox = document.getElementById("errorBox");

const lightbox = document.getElementById("lightbox");
const closeLightbox = document.getElementById("closeLightbox");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const lightboxBody = document.getElementById("lightboxBody");
const lightboxName = document.getElementById("lightboxName");

const gate = document.getElementById("gate");
const gateClose = document.getElementById("gateClose");
const gateBtn = document.getElementById("gateBtn");
const gateCode = document.getElementById("gateCode");
const gateMsg = document.getElementById("gateMsg");

document.querySelectorAll(".tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    const nextTab = btn.dataset.tab;

    if (nextTab === "premium" && !premiumUnlocked) {
      openGate();
      return;
    }

    setActiveTab(nextTab);
  });
});

search.addEventListener("input", render);
clear.addEventListener("click", () => { search.value = ""; render(); });
reloadBtn.addEventListener("click", () => loadCatalog(true));

closeLightbox.addEventListener("click", hideLightbox);
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) hideLightbox(); });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    hideLightbox();
    closeGate();
  }
});

fullscreenBtn.addEventListener("click", () => {
  const el = lightboxBody.querySelector("video, img");
  if (!el) return;
  if (el.requestFullscreen) el.requestFullscreen();
  else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
});

function setActiveTab(nextTab) {
  document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
  const btn = document.querySelector(`.tab[data-tab="${nextTab}"]`);
  if (btn) btn.classList.add("active");

  currentTab = nextTab;
  render();
}

async function loadCatalog(bustCache = false) {
  try {
    errorBox.classList.add("hidden");
    statusEl.textContent = "Carregando catálogo…";

    const url = bustCache ? `media.json?ts=${Date.now()}` : "media.json";
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Não achei media.json (HTTP ${res.status}).`);

    catalog = await res.json();
    for (const k of ["photos", "shorts", "free", "premium"]) {
      if (!Array.isArray(catalog[k])) catalog[k] = [];
    }

    statusEl.textContent = "Online ✅";
    render();
  } catch (e) {
    statusEl.textContent = "Erro.";
    grid.innerHTML = "";
    empty.classList.remove("hidden");
    empty.textContent = "Nada para mostrar.";
    errorBox.textContent = `Falha ao carregar media.json. Detalhe: ${String(e.message || e)}`;
    errorBox.classList.remove("hidden");
  }
}

function render() {
  title.textContent = TAB_TITLES[currentTab] || "Conteúdo";
  tabLabel.textContent = TAB_TITLES[currentTab] || "Conteúdo";

  const list = catalog[currentTab] || [];
  total.textContent = String(list.length);

  const q = (search.value || "").toLowerCase().trim();
  const filtered = list.filter((item) => !q || (item.name || "").toLowerCase().includes(q));

  shown.textContent = String(filtered.length);
  empty.classList.toggle("hidden", filtered.length !== 0);
  empty.textContent = "Nada encontrado.";

  grid.innerHTML = filtered.map(cardHTML).join("");

  grid.querySelectorAll("[data-open]").forEach((el) => {
    el.addEventListener("click", () => {
      const payload = el.getAttribute("data-open");
      if (!payload) return;
      const item = JSON.parse(payload);
      showLightbox(item);
    });
  });

  // thumbnail do vídeo = 1º frame (sem tocar)
  grid.querySelectorAll("video.vthumb").forEach((v) => {
    v.addEventListener("loadedmetadata", () => {
      try { v.currentTime = Math.min(0.1, v.duration || 0.1); } catch {}
    }, { once: true });

    v.addEventListener("seeked", () => {
      try { v.pause(); } catch {}
    }, { once: true });
  });
}

function cardHTML(item) {
  const tag = (item.bucket || currentTab).toUpperCase();
  const payload = escAttr(JSON.stringify(item));
  const name = esc(item.name || "");
  const kind = (item.type === "photo") ? "FOTO" : "VÍDEO";

  let media = "";
  if (item.type === "photo") {
    media = `<img src="${escAttr(item.url)}" alt="${name}" loading="lazy">`;
  } else {
    const url = String(item.url || "");
    const isWebm = url.toLowerCase().endsWith(".webm");
    const mime = isWebm ? "video/webm" : "video/mp4";
    const poster = item.poster ? `poster="${escAttr(item.poster)}"` : "";
    media = `
      <video class="vthumb" muted playsinline preload="metadata" ${poster}>
        <source src="${escAttr(url)}" type="${mime}">
      </video>
    `;
  }

  return `
    <article class="card" data-open="${payload}">
      <div class="media">
        <span class="badge">${esc(kind)}</span>
        ${media}
      </div>
      <div class="meta">
        <div class="fname" title="${name}">${name}</div>
        <span class="tag">${esc(tag)}</span>
      </div>
    </article>
  `;
}

function showLightbox(item) {
  lightboxBody.innerHTML = "";
  lightboxName.textContent = item.name || "";

  if (item.type === "photo") {
    lightboxBody.innerHTML = `<img src="${escAttr(item.url)}" alt="${esc(item.name || "")}">`;
  } else {
    const url = String(item.url || "");
    const isWebm = url.toLowerCase().endsWith(".webm");
    const mime = isWebm ? "video/webm" : "video/mp4";

    // Dificulta botão "download" (não impede acesso via URL pública)
    lightboxBody.innerHTML = `
      <video controls autoplay playsinline preload="metadata"
             controlsList="nodownload noplaybackrate"
             disablePictureInPicture
             oncontextmenu="return false">
        <source src="${escAttr(url)}" type="${mime}">
      </video>
    `;
  }

  fullscreenBtn.disabled = false;
  lightbox.classList.remove("hidden");
}

function hideLightbox() {
  const v = lightbox.querySelector("video");
  if (v) { try { v.pause(); } catch {} }
  lightbox.classList.add("hidden");
}

/* Gate Premium */
function openGate() {
  gateMsg.textContent = "";
  gateCode.value = "";
  gate.classList.remove("hidden");
  setTimeout(() => gateCode.focus(), 0);
}
function closeGate() { gate.classList.add("hidden"); }

gateClose.addEventListener("click", closeGate);
gate.addEventListener("click", (e) => { if (e.target === gate) closeGate(); });

gateBtn.addEventListener("click", () => {
  const code = (gateCode.value || "").trim();
  if (!code) { gateMsg.textContent = "Digite um código."; return; }
  if (code !== PREMIUM_CODE) { gateMsg.textContent = "Código inválido."; return; }

  premiumUnlocked = true;
  closeGate();
  setActiveTab("premium");
});

/* Utils */
function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#39;",
  }[c]));
}
function escAttr(s) { return esc(s).replace(/`/g, ""); }

loadCatalog(true);
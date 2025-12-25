(() => {
  "use strict";

  const IDS = {
    usulSelect: "#usulSelect, #selectUsul, select[name='usul']",
    sablonSelect: "#sablonSelect, #selectSablon, select[name='sablon']",
    preview: "#previewText, #previewArea, #txtPreview, #output",

    btnGenerate: "#btnGenerate, #btnMetniUret, button[data-action='generate']",
    btnCopy: "#btnCopy, #btnKopyala, button[data-action='copy']",
    btnClear: "#btnClear, #btnTemizle, button[data-action='clear']",

    yArgInput: "#yargitaySearch, #txtYargitayAra, input[name='yargitayAra']",
    yBtnSearch: "#btnYargitayAra, button[data-action='yargitay-search']",
    yBtnReload: "#btnYargitayReload, button[data-action='yargitay-reload']",
    yResults: "#yargitayResults, #lstYargitaySonuc, #yargitaySonuc",
    yBtnInsert: "#btnYargitayInsert, #btnMetneAktar, button[data-action='yargitay-insert']",
    yBtnDetail: "#btnYargitayDetay, button[data-action='yargitay-detail']",
  };

  const STATE = {
    sablonlar: {},
    yargitay: {},
    lastYargitayList: [],
    selectedYargitayIndex: -1,
  };

  function $(sel) {
    const parts = sel.split(",").map(s => s.trim()).filter(Boolean);
    for (const p of parts) {
      const el = document.querySelector(p);
      if (el) return el;
    }
    return null;
  }

  function log(...a) { console.log("[APP]", ...a); }
  function warn(...a) { console.warn("[APP]", ...a); }
  function err(...a) { console.error("[APP]", ...a); }

  function normalizeUsulToCode(raw) {
    const s = String(raw || "").toUpperCase().trim();
    if (s.includes("251")) return "CMK251";
    if (s.includes("250")) return "CMK250";
    return "CMK250";
  }

  function safeReadJson(candidates) {
    for (const name of candidates) {
      try {
        const data = window.api.readJson(name);
        log("JSON loaded:", name);
        return data;
      } catch {}
    }
    throw new Error("JSON okunamadı: " + candidates.join(" / "));
  }

  // JSON Map değilse (Array ise) map'e çevir
  function coerceSablonlarToMap(data) {
    // Map ise:
    if (data && !Array.isArray(data) && typeof data === "object") return data;

    // Array ise:
    if (Array.isArray(data)) {
      const out = {};
      for (const item of data) {
        if (!item || typeof item !== "object") continue;

        const usul = normalizeUsulToCode(item.usul || item.usulCode || item.cmk || item.procedure || "");
        const key = item.key || item.id || item.code || item.slug || item.templateKey || item.name;
        if (!key) continue;

        if (!out[usul]) out[usul] = {};
        out[usul][String(key)] = {
          ...item,
          name: item.name || String(key),
          blocks: Array.isArray(item.blocks) ? item.blocks : (item.blocks ? [item.blocks] : []),
        };
      }
      return out;
    }

    return {};
  }

  function coerceYargitayToMap(data) {
    if (data && !Array.isArray(data) && typeof data === "object") return data;

    if (Array.isArray(data)) {
      const out = {};
      for (const item of data) {
        if (!item || typeof item !== "object") continue;
        const usul = normalizeUsulToCode(item.usul || item.usulCode || item.cmk || item.procedure || "");
        if (!out[usul]) out[usul] = [];
        out[usul].push(item);
      }
      return out;
    }

    return {};
  }

  function loadSablonlar() {
    const raw = safeReadJson(["sablonlar.json", "sablonlar"]);
    STATE.sablonlar = coerceSablonlarToMap(raw);
    return STATE.sablonlar;
  }

  function loadYargitay() {
    const raw = safeReadJson(["yargitay_kutuphanesi.json", "yargitay_kutuphanesi"]);
    STATE.yargitay = coerceYargitayToMap(raw);
    return STATE.yargitay;
  }

  function populateSablonDropdown() {
    const usulEl = $(IDS.usulSelect);
    const sablonEl = $(IDS.sablonSelect);
    if (!sablonEl) return warn("Şablon select bulunamadı:", IDS.sablonSelect);

    const usul = normalizeUsulToCode(usulEl ? usulEl.value : "CMK250");
    const bucket = STATE.sablonlar?.[usul];

    sablonEl.innerHTML = "";
    const opt0 = document.createElement("option");
    opt0.value = "";
    opt0.textContent = "(Şablon seç)";
    sablonEl.appendChild(opt0);

    if (!bucket || typeof bucket !== "object") {
      warn("Bu usul için şablon bulunamadı:", usul, bucket);
      return;
    }

    for (const [key, tpl] of Object.entries(bucket)) {
      const opt = document.createElement("option");
      opt.value = key;
      opt.textContent = tpl?.name || key;
      sablonEl.appendChild(opt);
    }

    log("Şablonlar dolduruldu:", usul, Object.keys(bucket).length);
  }

  function buildTextFromTemplate() {
    const usulEl = $(IDS.usulSelect);
    const sablonEl = $(IDS.sablonSelect);
    const previewEl = $(IDS.preview);

    const usul = normalizeUsulToCode(usulEl ? usulEl.value : "CMK250");
    const key = sablonEl ? sablonEl.value : "";
    if (!key) throw new Error("Şablon seçilmedi.");

    const tpl = STATE.sablonlar?.[usul]?.[key];
    if (!tpl) throw new Error("Şablon bulunamadı: " + usul + "/" + key);

    const directText = tpl.text || tpl.md || tpl.body || tpl.content;
    if (typeof directText === "string" && directText.trim()) return directText;

    const blocks = Array.isArray(tpl.blocks) ? tpl.blocks : [];
    let out = `# ${tpl.name || "Karar Taslağı"}\n\n`;
    out += `**Usul:** ${usul}\n\n---\n\n`;
    for (const b of blocks) {
      out += `## ${String(b).toUpperCase()}\n\n(...)\n\n`;
    }
    return out;
  }

  function onGenerate() {
    const previewEl = $(IDS.preview);
    try {
      const text = buildTextFromTemplate();
      if (previewEl && "value" in previewEl) previewEl.value = text;
      else if (previewEl) previewEl.textContent = text;
      log("Metin üretildi.");
    } catch (e) {
      err(e);
      const msg = "HATA: " + (e?.message || String(e));
      if (previewEl && "value" in previewEl) previewEl.value = msg;
      else if (previewEl) previewEl.textContent = msg;
    }
  }

  function onCopy() {
    const previewEl = $(IDS.preview);
    const text = previewEl ? (("value" in previewEl) ? previewEl.value : previewEl.textContent) : "";
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => log("Kopyalandı.")).catch(err);
  }

  function onClear() {
    const previewEl = $(IDS.preview);
    if (previewEl && "value" in previewEl) previewEl.value = "";
    else if (previewEl) previewEl.textContent = "";
    log("Temizlendi.");
  }

  function renderYargitayResults(list) {
    const box = $(IDS.yResults);
    if (!box) return warn("Yargıtay sonuç kutusu bulunamadı:", IDS.yResults);

    STATE.lastYargitayList = list || [];
    STATE.selectedYargitayIndex = (list && list.length) ? 0 : -1;

    if (!list || !list.length) {
      if ("value" in box) box.value = "Sonuç yok.";
      else box.textContent = "Sonuç yok.";
      return;
    }

    const lines = list.slice(0, 200).map((it, i) => {
      const title = it.baslik || it.title || it.konu || it.madde || it.tck || it.ozet || `Kayıt ${i + 1}`;
      return `${i === 0 ? "▶ " : "  "}${i + 1}. ${String(title).replace(/\s+/g, " ").trim()}`;
    });

    if ("value" in box) box.value = lines.join("\n");
    else box.textContent = lines.join("\n");
  }

  function filterYargitay() {
    const usulEl = $(IDS.usulSelect);
    const qEl = $(IDS.yArgInput);

    const usul = normalizeUsulToCode(usulEl ? usulEl.value : "CMK250");
    const q = String(qEl ? qEl.value : "").trim().toLowerCase();

    let list = [];
    const bucket = STATE.yargitay?.[usul];
    if (Array.isArray(bucket)) list = bucket;
    else if (bucket && typeof bucket === "object") list = Object.values(bucket);

    if (q) {
      list = list.filter(it => JSON.stringify(it).toLowerCase().includes(q));
    }

    renderYargitayResults(list);
    log("Yargıtay filtre:", usul, "q=", q, "sonuç=", list.length);
  }

  function onYargitayReload() {
    try {
      loadYargitay();
      filterYargitay();
      log("Yargıtay yenilendi.");
    } catch (e) {
      err(e);
    }
  }

  function onYargitayInsert() {
    const previewEl = $(IDS.preview);
    if (!previewEl) return;

    const idx = STATE.selectedYargitayIndex;
    const item = (idx >= 0) ? STATE.lastYargitayList[idx] : null;
    if (!item) return;

    const text =
      item.metin || item.text || item.karar || item.content || item.body ||
      (typeof item === "string" ? item : JSON.stringify(item, null, 2));

    const insert = "\n\n---\n\n## Yargıtay\n\n" + text + "\n";
    if ("value" in previewEl) previewEl.value = (previewEl.value || "") + insert;
    else previewEl.textContent = (previewEl.textContent || "") + insert;

    log("Yargıtay metne aktarıldı.");
  }

  function onYargitayDetail() {
    const idx = STATE.selectedYargitayIndex;
    const item = (idx >= 0) ? STATE.lastYargitayList[idx] : null;
    if (!item) return;
    alert(JSON.stringify(item, null, 2));
  }

  function bindEvents() {
    const usulEl = $(IDS.usulSelect);
    const btnGen = $(IDS.btnGenerate);
    const btnCopy = $(IDS.btnCopy);
    const btnClear = $(IDS.btnClear);

    const ySearch = $(IDS.yBtnSearch);
    const yReload = $(IDS.yBtnReload);
    const yInsert = $(IDS.yBtnInsert);
    const yDetail = $(IDS.yBtnDetail);
    const yQ = $(IDS.yArgInput);

    if (usulEl) usulEl.addEventListener("change", () => {
      populateSablonDropdown();
      filterYargitay();
    });

    if (btnGen) btnGen.addEventListener("click", onGenerate);
    if (btnCopy) btnCopy.addEventListener("click", onCopy);
    if (btnClear) btnClear.addEventListener("click", onClear);

    if (ySearch) ySearch.addEventListener("click", filterYargitay);
    if (yReload) yReload.addEventListener("click", onYargitayReload);
    if (yInsert) yInsert.addEventListener("click", onYargitayInsert);
    if (yDetail) yDetail.addEventListener("click", onYargitayDetail);

    if (yQ) yQ.addEventListener("keydown", (e) => {
      if (e.key === "Enter") filterYargitay();
    });
  }

  function init() {
    if (!window.api || typeof window.api.readJson !== "function") {
      console.error("window.api.readJson yok. preload.js bağlanmamış.");
      return;
    }

    bindEvents();

    try { loadSablonlar(); } catch (e) { err("Şablon yükleme hatası:", e); }
    try { loadYargitay(); } catch (e) { err("Yargıtay yükleme hatası:", e); }

    populateSablonDropdown();
    filterYargitay();

    log("Init tamam.");
  }

  document.addEventListener("DOMContentLoaded", init);
})();
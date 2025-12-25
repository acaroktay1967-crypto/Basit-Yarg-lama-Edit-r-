<!doctype html>
<html lang="tr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>CMK 250 / CMK 251 — Tek Bütün</title>

  <style>
    :root{
      --bg: #fff7c2;           /* açık limon */
      --card: rgba(255,255,255,.55);
      --card2: rgba(255,255,255,.35);
      --border: rgba(20,40,80,.18);
      --text: #0c1b33;
      --muted: rgba(12,27,51,.65);
      --accent: rgba(44,97,201,.95);
      --ok: rgba(37,140,83,.15);
      --warn: rgba(230,180,40,.18);
      --danger: rgba(205,60,60,.14);
      --shadow: 0 14px 40px rgba(0,0,0,.10);
      --radius: 16px;
      --radius2: 14px;
    }

    *{ box-sizing: border-box; }
    body{
      margin:0;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      color: var(--text);
      background: radial-gradient(1200px 600px at 30% 10%, rgba(255,255,255,.65), rgba(255,255,255,0) 60%),
                  radial-gradient(900px 500px at 70% 15%, rgba(255,255,255,.50), rgba(255,255,255,0) 62%),
                  var(--bg);
    }

    .wrap{ max-width: 1180px; margin: 0 auto; padding: 22px 18px 28px; }

    .header{
      display:flex; align-items:flex-start; justify-content:space-between; gap:16px;
      margin-bottom: 14px;
    }
    .title{
      font-size: 28px; font-weight: 800; letter-spacing: .2px; margin:0;
    }
    .subtitle{
      margin:8px 0 0 0; color: var(--muted); font-size: 13.5px; line-height: 1.35;
    }

    .grid{
      display:grid;
      grid-template-columns: 1.05fr .95fr;
      gap: 16px;
      align-items: start;
    }

    .card{
      background: linear-gradient(180deg, var(--card), var(--card2));
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      overflow: hidden;
      position: relative;
    }
    .card-inner{ padding: 14px; }

    /* Sekmeler */
    .tabs{
      display:flex; gap:10px; flex-wrap: wrap;
      padding: 12px 12px 10px;
      border-bottom: 1px solid var(--border);
      background: rgba(255,255,255,.25);
    }
    .tab{
      appearance:none; border:1px solid rgba(20,40,80,.22);
      background: rgba(255,255,255,.40);
      color: var(--text);
      padding: 9px 12px;
      border-radius: 999px;
      font-weight: 700;
      cursor: pointer;
      transition: transform .06s ease, background .12s ease;
    }
    .tab:active{ transform: translateY(1px); }
    .tab.active{
      background: rgba(44,97,201,.12);
      border-color: rgba(44,97,201,.35);
      color: rgba(12,27,51,.95);
    }

    .panel{ display:none; }
    .panel.active{ display:block; }

    .row{ display:flex; gap: 10px; flex-wrap: wrap; align-items: center; margin: 10px 0; }
    label{ font-size: 12.5px; color: var(--muted); font-weight: 700; }
    input, select, textarea{
      width: 100%;
      border-radius: 12px;
      border: 1px solid rgba(20,40,80,.22);
      background: rgba(255,255,255,.55);
      padding: 10px 12px;
      outline: none;
      font: inherit;
    }
    textarea{ min-height: 92px; resize: vertical; }

    .btn{
      appearance:none; border: 1px solid rgba(20,40,80,.22);
      background: rgba(255,255,255,.55);
      padding: 9px 12px;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 800;
    }
    .btn.primary{
      border-color: rgba(44,97,201,.35);
      background: rgba(44,97,201,.12);
    }

    .hint{ font-size: 12.5px; color: var(--muted); margin: 8px 0 0 0; }

    .preview-title{
      margin:0; font-size: 18px; font-weight: 900;
    }
    pre#preview{
      margin: 10px 0 0 0;
      padding: 12px;
      border-radius: var(--radius2);
      border: 1px solid var(--border);
      background: rgba(255,255,255,.55);
      white-space: pre-wrap;
      word-break: break-word;
      min-height: 360px;
      line-height: 1.35;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 12.5px;
    }

    /* iframe */
    #legacyFrame{
      width: 100%;
      height: 70vh;
      border: 0;
      border-radius: var(--radius2);
      background: rgba(255,255,255,.55);
    }

    /* Küçük ekran */
    @media (max-width: 980px){
      .grid{ grid-template-columns: 1fr; }
      pre#preview{ min-height: 240px; }
    }
  </style>
</head>

<body>
  <div class="wrap">
    <div class="header">
      <div>
        <h1 class="title">CMK 250 / CMK 251 — Tek Bütün</h1>
        <p class="subtitle">
          Aynı veriden: Standart / Kısa / HAGB gibi farklı kurguda hüküm metni üretimi.
          İtiraz işaretlenirse indirimler otomatik düşer.
        </p>
      </div>
    </div>

    <div class="grid">

      <!-- SOL: Sekmeler -->
      <div class="card">
        <div class="tabs" id="tabs">
          <button class="tab active" data-tab="form" type="button">Form</button>
          <button class="tab" data-tab="sablon" type="button">Şablonlar</button>
          <button class="tab" data-tab="yargitay" type="button">Yargıtay</button>
          <button class="tab" data-tab="kutuphane" type="button">Kütüphane</button>
        </div>

        <div class="card-inner">

          <!-- FORM -->
          <div id="panel-form" class="panel active">
            <div class="row">
              <div style="flex:1; min-width: 220px;">
                <label>Usul</label>
                <select id="usul">
                  <option value="cmk250">CMK 250 — Seri Muhakeme</option>
                  <option value="cmk251">CMK 251 — Basit Yargılama</option>
                </select>
              </div>
              <div style="flex:1; min-width: 220px;">
                <label>TCK Maddesi</label>
                <input id="tckMadde" placeholder="Örn: TCK 86" />
              </div>
            </div>

            <div class="row">
              <div style="flex:1; min-width: 220px;">
                <label>İtiraz</label>
                <select id="itiraz">
                  <option value="hayir">Hayır</option>
                  <option value="evet">Evet (genel hükümlere dönüş)</option>
                </select>
              </div>
              <div style="flex:1; min-width: 220px;">
                <label>Şablon Seçimi</label>
                <select id="sablonSelect">
                  <option value="">(Şablonlar panelinden seç)</option>
                </select>
              </div>
            </div>

            <div class="row">
              <button class="btn primary" id="btnUret" type="button">Metni Üret</button>
              <button class="btn" id="btnKopyala" type="button">Kopyala</button>
              <button class="btn" id="btnTemizle" type="button">Temizle</button>
            </div>

            <p class="hint">Not: Şablon seçimi, metnin blok kurgusunu değiştirir. İtiraz “Evet” seçilirse CMK indirimleri düşer.</p>
          </div>

          <!-- ŞABLON -->
          <div id="panel-sablon" class="panel">
            <p class="hint" style="margin-top:0">
              Şablonlar <code>data/sablonlar.json</code> içinden gelir. (Dosya yoksa boş görünür.)
            </p>
            <div class="row">
              <div style="flex:1; min-width: 260px;">
                <label>Şablon</label>
                <select id="sablonSelectPanel">
                  <option value="">(yükleniyor...)</option>
                </select>
              </div>
              <button class="btn primary" id="btnSablonUygula" type="button">Seçili Şablonu Kullan</button>
              <button class="btn" id="btnSablonYenile" type="button">Yenile (Reload)</button>
            </div>

            <div class="row" style="width:100%">
              <div style="flex:1; min-width: 260px;">
                <label>Şablon Açıklaması</label>
                <textarea id="sablonAciklama" placeholder="Şablon açıklaması..." readonly></textarea>
              </div>
            </div>

            <p class="hint">“Boş geliyorsa”: EXE içinde data dosyası yoktur veya path yanlış paketlenmiştir.</p>
          </div>

          <!-- YARGITAY -->
          <div id="panel-yargitay" class="panel">
            <p class="hint" style="margin-top:0">
              Yargıtay önerisi: Usul + TCK maddesine göre eşleştirir.
            </p>

            <div class="row">
              <div style="flex:1; min-width: 260px;">
                <label>Arama</label>
                <input id="yargitayAra" placeholder="Örn: TCK 86 / anahtar kelime / daire..." />
              </div>
              <button class="btn primary" id="btnYargitayAra" type="button">Ara</button>
              <button class="btn" id="btnYargitayYenile" type="button">Yenile (Reload)</button>
            </div>

            <div id="yargitaySonuc" class="card" style="margin-top:10px">
              <div class="card-inner">
                <strong>Sonuç</strong>
                <div class="hint" id="yargitaySonucText">Henüz arama yapılmadı.</div>
              </div>
            </div>

            <div class="row" style="margin-top:10px">
              <button class="btn" id="btnYargitayDetay" type="button">Detay</button>
              <button class="btn" id="btnYargitayMetneAktar" type="button">Metne Aktar</button>
            </div>
          </div>

          <!-- KÜTÜPHANE -->
          <div id="panel-kutuphane" class="panel">
            <h2 style="margin:0 0 8px 0">Kütüphane</h2>

            <div class="row" style="margin-top:0">
              <button class="btn primary" id="btnLegacyCmk250" type="button">CMK 250 – Karar Kütüphanesi</button>
              <button class="btn primary" id="btnLegacySuc" type="button">Suç Türleri Kütüphanesi</button>
            </div>

            <iframe id="legacyFrame" title="Kütüphane"></iframe>

            <p class="hint">
              Bu butonlar iframe içinde <code>legacy_repo/</code> altındaki HTML’leri açar.
              (Bağlantı kodu <code>legacy_hooks.js</code> içinde çalışır.)
            </p>
          </div>

        </div>
      </div>

      <!-- SAĞ: ÖNİZLEME -->
      <div class="card">
        <div class="card-inner">
          <h3 class="preview-title">Önizleme (Resmi Metin)</h3>
          <pre id="preview"></pre>
          <p class="hint">Üretilen metin burada görünür. Kopyala butonu ile panoya alınır.</p>
        </div>
      </div>

    </div>
  </div>

  <!-- TEK SCRIPT: module -->
  <script type="module" src="./renderer.js"></script>
</body>
</html>
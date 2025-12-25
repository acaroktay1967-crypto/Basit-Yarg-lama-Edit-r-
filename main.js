"use strict";

const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

const APP_NAME = "CMK 250-251 Tek Bütün";

function pickExisting(candidates) {
  for (const p of candidates) {
    try {
      if (p && fs.existsSync(p)) return p;
    } catch {}
  }
  return null;
}

/**
 * relPath örn: "data/sablonlar.json"
 * packaged'da öncelik: process.resourcesPath\data\...
 */
function resolveReadablePath(relPath) {
  const clean = String(relPath || "").replace(/^([.][/\\])+/, "");
  const baseName = path.basename(clean);

  const candidates = [
    // packaged extraResources:
    path.join(process.resourcesPath, clean),
    path.join(process.resourcesPath, "data", baseName),

    // dev / farklı yerleşimler:
    path.join(app.getAppPath(), clean),
    path.join(app.getAppPath(), "data", baseName),
    path.join(__dirname, clean),
    path.join(__dirname, "data", baseName),
    path.join(__dirname, "renderer", clean),
    path.join(__dirname, "renderer", "data", baseName),
  ];

  return pickExisting(candidates);
}

/* ============ IPC: fs:loadJson (HATAYI KAPATAN KISIM) ============ */
ipcMain.handle("fs:loadJson", async (_e, { relPath }) => {
  try {
    const p = resolveReadablePath(relPath);
    if (!p) return { ok: false, error: `Dosya bulunamadı: ${relPath}` };

    const raw = fs.readFileSync(p, "utf-8");
    return { ok: true, data: JSON.parse(raw), path: p };
  } catch (err) {
    return { ok: false, error: String(err?.message || err) };
  }
});

function createMainWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: APP_NAME,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // ✅ Senin index.html burada:
  win.loadFile(path.join(__dirname, "renderer", "index.html"));

  // İstersen devtools:
  // win.webContents.openDevTools({ mode: "detach" });

  return win;
}

app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
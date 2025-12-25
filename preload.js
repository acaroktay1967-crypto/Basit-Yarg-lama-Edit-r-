"use strict";

const { contextBridge, ipcRenderer } = require("electron");
const fs = require("fs");
const path = require("path");

/**
 * En sağlam okuma:
 * 1) packaged: process.resourcesPath\data\<file>
 * 2) dev: proje kökü data\<file> veya renderer\data\<file>
 */
function getDataPath(filename) {
  const baseName = path.basename(String(filename || ""));
  const candidates = [
    path.join(process.resourcesPath, "data", baseName),
    path.join(__dirname, "data", baseName),
    path.join(__dirname, "renderer", "data", baseName),
  ];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) return p;
    } catch {}
  }
  // fallback
  return path.join(process.resourcesPath, "data", baseName);
}

function readJsonDirect(filename) {
  const p = getDataPath(filename);
  const raw = fs.readFileSync(p, "utf-8");
  return JSON.parse(raw);
}

contextBridge.exposeInMainWorld("api", {
  // Doğrudan fs ile (senin renderer.js bunu kullanıyor)
  readJson: (filename) => readJsonDirect(filename),

  // Eski kodlar IPC istiyorsa (fs:loadJson) bu da var
  loadJson: async (relPath) => ipcRenderer.invoke("fs:loadJson", { relPath }),

  dataPath: (filename) => getDataPath(filename),
});
#!/usr/bin/env node
/**
 * Packaging script — produces peakclipper-v{version}.zip
 * Contains only runtime files. No TypeScript source included.
 */

const fs   = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT    = path.resolve(__dirname, "..");
const pkg     = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
const VERSION = pkg.version;
const OUT_DIR = path.join(ROOT, "dist");
const PKG_DIR = path.join(OUT_DIR, "peakclipper");
const ZIP_OUT = path.join(OUT_DIR, `peakclipper-v${VERSION}.zip`);

// ── helpers ──────────────────────────────────────────────────────────────────

function cp(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (fs.statSync(src).isDirectory()) {
    execSync(`cp -r "${src}" "${dest}"`);
  } else {
    fs.copyFileSync(src, dest);
  }
}

function write(dest, content) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, content, "utf8");
}

// ── clean & recreate dist ────────────────────────────────────────────────────

console.log("🧹  Cleaning dist/...");
if (fs.existsSync(OUT_DIR)) execSync(`rm -rf "${OUT_DIR}"`);
fs.mkdirSync(PKG_DIR, { recursive: true });

// ── copy runtime files ───────────────────────────────────────────────────────

console.log("📦  Copying .next/ build...");
cp(path.join(ROOT, ".next"), path.join(PKG_DIR, ".next"));

console.log("🖼️   Copying public/ assets...");
cp(path.join(ROOT, "public"), path.join(PKG_DIR, "public"));

console.log("⚙️   Copying next.config.ts...");
cp(path.join(ROOT, "next.config.ts"), path.join(PKG_DIR, "next.config.ts"));

console.log("📄  Copying docs...");
cp(path.join(ROOT, "README.md"), path.join(PKG_DIR, "README.md"));
fs.mkdirSync(path.join(PKG_DIR, "docs"), { recursive: true });
cp(path.join(ROOT, "docs", "USER_GUIDE.md"), path.join(PKG_DIR, "docs", "USER_GUIDE.md"));

// ── write stripped package.json (runtime deps only, no devDeps) ──────────────

console.log("📝  Writing package.json (runtime only)...");
const distPkg = {
  name: "peakclipper",
  version: VERSION,
  private: true,
  scripts: {
    start: "next start",
    "start:port": "next start -p $PORT",
  },
  dependencies: pkg.dependencies,
  engines: { node: ">=18" },
};
write(path.join(PKG_DIR, "package.json"), JSON.stringify(distPkg, null, 2) + "\n");

// ── write .env.example ───────────────────────────────────────────────────────

console.log("🔑  Writing .env.example...");
write(path.join(PKG_DIR, ".env.example"), [
  "# PeakClipper — environment variables",
  "# Copy this file to .env.local and fill in the values.",
  "",
  "# (Optional) Server port — default 3000",
  "PORT=3000",
  "",
  "# (Optional) Set to 'production' for prod deployments",
  "NODE_ENV=production",
  "",
].join("\n"));

// ── write INSTALL.txt ─────────────────────────────────────────────────────────

console.log("📋  Writing INSTALL.txt...");
write(path.join(PKG_DIR, "INSTALL.txt"), [
  "PeakClipper v" + VERSION + " — Quick Start",
  "=".repeat(40),
  "",
  "Requirements",
  "------------",
  "  Node.js 18+   https://nodejs.org",
  "  yt-dlp        https://github.com/yt-dlp/yt-dlp  (optional — for real clips)",
  "  ffmpeg        https://ffmpeg.org                 (optional — for real clips)",
  "",
  "Without yt-dlp/ffmpeg the app runs in Demo Mode automatically.",
  "",
  "Install & Run",
  "-------------",
  "  1. npm install --omit=dev",
  "  2. npm start",
  "  3. Open http://localhost:3000",
  "",
  "Custom port:",
  "  PORT=8080 npm start",
  "",
  "See README.md for full deployment options (Railway, VPS, Docker, Vercel).",
  "See docs/USER_GUIDE.md for the end-user manual.",
  "",
  "© " + new Date().getFullYear() + " PeakClipper. All rights reserved.",
  "Redistribution or resale of this software is prohibited.",
  "",
].join("\n"));

// ── write LICENSE ─────────────────────────────────────────────────────────────

console.log("📜  Writing LICENSE...");
write(path.join(PKG_DIR, "LICENSE"), [
  "PEAKCLIPPER COMMERCIAL LICENSE",
  "=".repeat(40),
  "",
  "Copyright (c) " + new Date().getFullYear() + " PeakClipper. All rights reserved.",
  "",
  "This software is provided as a compiled build and licensed, not sold,",
  "to the original purchaser under the following terms:",
  "",
  "PERMITTED",
  "  - Install and operate on a single production server per license",
  "  - Use commercially for your own projects or clients",
  "",
  "PROHIBITED",
  "  - Redistribute, share, resell, or sublicense this software",
  "  - Modify or attempt to reverse-engineer the compiled build",
  "  - Remove or alter this license or any copyright notices",
  "  - Use to build a competing product for commercial resale",
  "",
  "Violation of these terms immediately terminates your license.",
  "",
].join("\n"));

// ── zip ──────────────────────────────────────────────────────────────────────

console.log("🗜️   Zipping to", path.basename(ZIP_OUT), "...");
execSync(`cd "${OUT_DIR}" && zip -r "${ZIP_OUT}" peakclipper/`, { stdio: "inherit" });
execSync(`rm -rf "${PKG_DIR}"`);

// ── stats ─────────────────────────────────────────────────────────────────────

const zipSizeMB = (fs.statSync(ZIP_OUT).size / 1024 / 1024).toFixed(2);
console.log("");
console.log("✅  Done!");
console.log(`   → ${ZIP_OUT}`);
console.log(`   → Size: ${zipSizeMB} MB`);
console.log("");
console.log("Contents (no source code):");
execSync(`cd "${OUT_DIR}" && unzip -l "${ZIP_OUT}" | head -20`, { stdio: "inherit" });

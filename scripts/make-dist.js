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

console.log("🚂  Copying Railway / Docker deploy files...");
cp(path.join(ROOT, "railway.json"),   path.join(PKG_DIR, "railway.json"));
cp(path.join(ROOT, "nixpacks.toml"),  path.join(PKG_DIR, "nixpacks.toml"));
cp(path.join(ROOT, "Dockerfile"),     path.join(PKG_DIR, "Dockerfile"));

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
  "Two modes:",
  "  Demo Mode — no extra tools needed (Vercel, shared hosting)",
  "  Full Mode — requires yt-dlp + ffmpeg (Railway, VPS, Docker)",
  "",
  "──────────────────────────────────────────",
  "OPTION A  Railway  (easiest, ~$5/mo, Full Mode)",
  "──────────────────────────────────────────",
  "  1. Create a private GitHub repo and push this folder into it.",
  "     git init && git add . && git commit -m 'init'",
  "     git remote add origin https://github.com/YOU/REPO.git",
  "     git push -u origin main",
  "",
  "  2. Go to https://railway.app → New Project → Deploy from GitHub repo",
  "     Select your repo. Railway detects nixpacks.toml automatically.",
  "     It will install yt-dlp + ffmpeg and build the app.",
  "",
  "  3. In Railway → Settings → Networking → Generate Domain",
  "     Your app is live in Full Mode. Enjoy real YouTube clipping!",
  "",
  "  (railway.json and nixpacks.toml are already included in this package.)",
  "",
  "──────────────────────────────────────────",
  "OPTION B  Docker  (VPS, any cloud)",
  "──────────────────────────────────────────",
  "  docker build -t peakclipper .",
  "  docker run -p 3000:3000 peakclipper",
  "",
  "  Dockerfile is already included. Installs yt-dlp + ffmpeg automatically.",
  "",
  "──────────────────────────────────────────",
  "OPTION C  VPS / Ubuntu Server  (manual)",
  "──────────────────────────────────────────",
  "  # Install yt-dlp",
  "  sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \\",
  "    -o /usr/local/bin/yt-dlp && sudo chmod +x /usr/local/bin/yt-dlp",
  "",
  "  # Install ffmpeg",
  "  sudo apt update && sudo apt install -y ffmpeg",
  "",
  "  # Start the app",
  "  npm install --omit=dev",
  "  npm start",
  "",
  "──────────────────────────────────────────",
  "OPTION D  Demo / Preview only (Vercel, Netlify)",
  "──────────────────────────────────────────",
  "  Without yt-dlp the app auto-switches to Demo Mode.",
  "  Clips are simulated — UI is fully functional for sales demos.",
  "",
  "  npm install --omit=dev",
  "  npm start",
  "",
  "──────────────────────────────────────────",
  "Custom port:",
  "  PORT=8080 npm start",
  "",
  "Health check:",
  "  GET /api/health  →  { mode: 'full'|'demo', binaries: { ytdlp, ffmpeg } }",
  "",
  "See README.md for Nginx config, PM2, and advanced options.",
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

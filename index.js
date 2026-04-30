#!/usr/bin/env node

import chalk from "chalk";
import { execSync } from "node:child_process";
import * as fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { macros } from "./macros.js";

// ======================== PATH SETUP ==========================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templateDirectory = path.join(__dirname, "templates");

// ======================== HELPERS ==========================

function log(msg) {
  console.log(chalk.bgBlue(msg));
}

function err(msg) {
  console.log(chalk.bgRed(msg));
}

function copyFile(templatePath, targetPath) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(templatePath, targetPath);
}

// ======================== VALIDATE INPUT ==========================

const appName = process.argv[2];

if (!appName) {
  err("Usage: create-vite-app <app-name> [target-directory]");
  process.exit(1);
}

const target = process.argv[3]?.toLowerCase();

const targetDirectory = macros.get(target) || process.argv[3] || process.cwd();
const projectPath = path.resolve(targetDirectory, appName);

if (fs.existsSync(projectPath)) {
  err("Folder already exists!");
  process.exit(1);
}

log("Running setup script...");

// ======================== CREATE VITE PROJECT ==========================

log(`[${projectPath}] Creating project`);
fs.mkdirSync(targetDirectory, { recursive: true });
process.chdir(targetDirectory);

execSync(`pnpm create vite "${appName}" --template react-ts --no-interactive`, { stdio: "ignore" });

// ======================== ENTER PROJECT ==========================

process.chdir(appName);

// ======================== INSTALL DEPENDENCIES ==========================

log(`[${projectPath}] Installing dependencies...`);

execSync(`pnpm add -D tailwindcss @tailwindcss/vite prettier prettier-plugin-tailwindcss vite-plugin-svgr @vitejs/plugin-react`, { stdio: "inherit" });

execSync(`pnpm add react-router-dom tailwind-merge`, { stdio: "inherit" });

// ======================== CREATE FOLDERS ==========================

log(`[${projectPath}] Creating folders...`);
const folders = ["src/components", "src/styles", "src/lib", "src/routes"];

folders.forEach((folder) => {
  fs.mkdirSync(folder, { recursive: true });
});

// ======================== CLEAN DEFAULT FILES ==========================

// Clear these directories
["public", "src/assets"].forEach((folder) => {
  if (fs.existsSync(folder)) {
    fs.rmSync(folder, { recursive: true, force: true });
  }
  fs.mkdirSync(folder, { recursive: true });
});

// Delete these files
["src/App.tsx", "src/App.css", "src/index.css"].forEach((file) => {
  if (fs.existsSync(file)) fs.rmSync(file, { force: true });
});

// ======================== COPY TEMPLATE FILES ==========================

log(`[${projectPath}] Copying template files...`);

const files = [
  [".prettierrc.json", ".prettierrc.json"],
  ["App.tsx", "src/routes/App.tsx"],
  ["main.tsx", "src/main.tsx"],
  ["index.css", "src/styles/index.css"],
  ["vite-env.d.ts", "src/vite-env.d.ts"],
  ["vite.config.ts", "vite.config.ts"],
  ["tsconfig.app.json", "tsconfig.app.json"],
];

files.forEach(([from, to]) => {
  copyFile(path.join(templateDirectory, from), path.join(projectPath, to));
});

// ======================== INIT GIT ==========================

log(`[${projectPath}] Creating a git repository...`);
try {
  execSync("git init", { stdio: "ignore" });
  execSync("git add .", { stdio: "ignore" });
  execSync(`git commit -m "init commit"`, { stdio: "ignore" });
  execSync("git branch -M main", { stdio: "ignore" });
} catch {
  err("Git init failed (git not installed?)");
}

// ======================== OPEN VS CODE ==========================

log(`[${projectPath}] Opening VSCode...`);

try {
  execSync(`code "${projectPath}"`, { stdio: "inherit" });
} catch {
  err("VSCode CLI not found, skipping...");
}

log(`[${projectPath}] Setup complete.`);

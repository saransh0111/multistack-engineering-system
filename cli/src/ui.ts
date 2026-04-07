import pc from "picocolors";
import { MASCOT_BLOCK_LINES, MASCOT_BLOCK_WIDTH } from "./mascot-block-art.js";
import {
  defaultRepoWebUrl,
  normalizeRepoDisplayUrl,
  type MultistackPackage,
} from "./package-meta.js";
import { getInstallRoot } from "./paths.js";

function minimalBanner(): boolean {
  const v = process.env.MULTISTACK_MINIMAL_BANNER?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

/** Box width — matches dense block banner; long paths truncate with …. */
const W = MASCOT_BLOCK_WIDTH;

function top(): void {
  console.log(`  ${pc.cyan("╔" + "═".repeat(W) + "╗")}`);
}

function bot(): void {
  console.log(`  ${pc.cyan("╚" + "═".repeat(W) + "╝")}`);
}

/** Plain text row (no ANSI inside — keeps columns aligned). */
function row(s: string): void {
  const t = s.length > W ? s.slice(0, W - 1) + "…" : s + " ".repeat(W - s.length);
  console.log(`  ${pc.cyan("║")}${t}${pc.cyan("║")}`);
}

function blank(): void {
  console.log(`  ${pc.cyan("║")}${" ".repeat(W)}${pc.cyan("║")}`);
}

/** Center plain text in a fixed width (for ASCII art alignment). */
function padCenter(text: string, width: number): string {
  if (text.length >= width) {
    return text.slice(0, width);
  }
  const pad = width - text.length;
  const left = Math.floor(pad / 2);
  const right = pad - left;
  return " ".repeat(left) + text + " ".repeat(right);
}

/** Brand mark: dense block / Braille-style art (aligned with framed panels below). */
function printMascot(): void {
  console.log();
  if (minimalBanner()) {
    console.log(`  ${pc.cyan("  multistack")} ${pc.dim("· engineering skill pack")}`);
    console.log(`  ${pc.dim(padCenter("skills · rules · standards", W))}`);
    console.log(`  ${pc.dim(padCenter("clone once · @-attach from any workspace", W))}`);
    console.log();
    return;
  }
  for (const line of MASCOT_BLOCK_LINES) {
    console.log(`  ${pc.dim(pc.cyan(line))}`);
  }
  console.log(`  ${pc.dim(padCenter("skills · rules · standards", W))}`);
  console.log(`  ${pc.dim(padCenter("clone once · @-attach from any workspace", W))}`);
  console.log();
}

function printMaintainerBlock(pkg: MultistackPackage): void {
  const author = typeof pkg.author === "string" ? pkg.author.trim() : "";
  const repoUrl = pkg.repository?.url
    ? normalizeRepoDisplayUrl(pkg.repository.url)
    : defaultRepoWebUrl();
  console.log(
    `  ${pc.dim(`${pkg.name} v${pkg.version}${author ? ` · ${author}` : ""}`)}`
  );
  console.log(`  ${pc.dim(repoUrl)}`);
  console.log();
}

export function printBanner(pkg: MultistackPackage): void {
  printMascot();
  printMaintainerBlock(pkg);
  top();
  blank();
  row("   multistack  ·  engineering skill pack");
  row("   rules + .skill files  →  Cursor / IDE @-files");
  blank();
  bot();
  console.log();
}

export function bannerHelpText(pkg: MultistackPackage): string {
  const author = typeof pkg.author === "string" ? pkg.author.trim() : "";
  const repoUrl = pkg.repository?.url
    ? normalizeRepoDisplayUrl(pkg.repository.url)
    : defaultRepoWebUrl();
  return [
    "",
    `${pc.cyan("  multistack")} — install skills + rules globally`,
    pc.dim(`  ${pkg.name} v${pkg.version}${author ? ` · ${author}` : ""}`),
    pc.dim(`  ${repoUrl}`),
    "",
  ].join("\n");
}

export function printInstallIntro(repo: string, branch: string, pkg: MultistackPackage): void {
  printBanner(pkg);
  console.log(pc.dim(`  ▸  repo`) + `    ${pc.white(repo)}`);
  console.log(pc.dim(`  ▸  branch`) + `  ${pc.white(branch)}`);
  console.log(pc.dim(`  ▸  into`) + `   ${pc.white(getInstallRoot())}`);
  console.log();
  console.log(pc.dim("  A spinner runs while git works (no noisy clone log by default)."));
  console.log();
}

export function printInstallSuccess(root: string): void {
  console.log();
  top();
  row("  ✓  Install complete");
  blank();
  row(`     ${root}`);
  blank();
  row("  Next:");
  row("    multistack path");
  row("    multistack skill cross-cutting/god-mode.skill");
  blank();
  bot();
  console.log();
}

export function printAlreadyInstalled(root: string, pkg: MultistackPackage): void {
  printBanner(pkg);
  top();
  row("  Already installed — same version tree.");
  blank();
  row(`     ${root}`);
  blank();
  row("  Tip:  multistack update");
  blank();
  bot();
  console.log();
}

export function printUpdateSuccess(root: string): void {
  console.log();
  top();
  row("  ✓  Updated (git pull --ff-only)");
  blank();
  row(`     ${root}`);
  blank();
  bot();
  console.log();
}

export function printDoctorReport(
  nodeVersion: string,
  gitOk: boolean,
  multistackHome: string,
  root: string,
  exists: boolean,
  gitRepo: boolean | null,
  hasSkills: boolean | null,
  pkg: MultistackPackage
): void {
  printBanner(pkg);
  top();
  row("  doctor — environment");
  blank();
  row(`  Node.js          ${nodeVersion}`);
  row(`  git              ${gitOk ? "ok" : "MISSING (install Git)"}`);
  row(`  MULTISTACK_HOME  ${multistackHome}`);
  row(`  install root     ${root}`);
  row(`  exists           ${exists ? "yes" : "no"}`);
  if (exists) {
    row(`  git repo         ${gitRepo ? "yes" : "no"}`);
    row(`  skills/ tree     ${hasSkills ? "yes" : "no"}`);
  }
  blank();
  bot();
  console.log();
}

export function printListIntro(): void {
  console.log(pc.cyan("  ── skill domains (under skills/) ────────────────────────"));
  console.log();
}

export function printErrorBanner(title: string, detail: string): void {
  console.error();
  console.error(`  ${pc.red("╔" + "═".repeat(W) + "╗")}`);
  console.error(`  ${pc.red("║")}${pc.red(pc.bold(title.padEnd(W)))}${pc.red("║")}`);
  console.error(`  ${pc.red("║")}${" ".repeat(W)}${pc.red("║")}`);
  for (const line of detail.split("\n")) {
    const t = line.length > W ? line.slice(0, W - 1) + "…" : line + " ".repeat(W - line.length);
    console.error(`  ${pc.red("║")}${pc.dim(t)}${pc.red("║")}`);
  }
  console.error(`  ${pc.red("╚" + "═".repeat(W) + "╝")}`);
  console.error();
}

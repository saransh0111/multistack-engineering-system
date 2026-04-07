import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const DEFAULT_REPO =
  "https://github.com/saransh0111/multistack-engineering-system.git";

/**
 * Root directory where the skill pack is installed (git clone target).
 * Override with MULTISTACK_HOME.
 */
export function getInstallRoot(): string {
  const override = process.env.MULTISTACK_HOME?.trim();
  if (override) {
    return path.resolve(override);
  }

  if (process.platform === "win32") {
    const base =
      process.env.LOCALAPPDATA || path.join(os.homedir(), "AppData", "Local");
    return path.join(base, "multistack-engineering-system");
  }

  const xdg =
    process.env.XDG_DATA_HOME || path.join(os.homedir(), ".local", "share");
  return path.join(xdg, "multistack-engineering-system");
}

export function getDefaultRepoUrl(): string {
  return process.env.MULTISTACK_REPO_URL?.trim() || DEFAULT_REPO;
}

export function isGitRepo(dir: string): boolean {
  return fs.existsSync(path.join(dir, ".git"));
}

export function hasSkillsTree(dir: string): boolean {
  return fs.existsSync(path.join(dir, "skills"));
}

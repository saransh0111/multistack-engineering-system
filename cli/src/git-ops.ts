import { spawn, spawnSync } from "node:child_process";

export function gitAvailable(): boolean {
  const r = spawnSync("git", ["--version"], { encoding: "utf-8" });
  return r.status === 0;
}

export function cloneShallow(
  repoUrl: string,
  targetDir: string,
  branch = "main"
): { ok: boolean; message: string } {
  const result = spawnSync(
    "git",
    ["clone", "--depth", "1", "--branch", branch, repoUrl, targetDir],
    {
      encoding: "utf-8",
    }
  );
  if (result.status !== 0) {
    const msg = (result.stderr || result.stdout || "").trim();
    return {
      ok: false,
      message: msg || "git clone failed",
    };
  }
  return { ok: true, message: "ok" };
}

/** Async clone (quiet stdio) — use with spinner in the terminal. */
export function cloneShallowAsync(
  repoUrl: string,
  targetDir: string,
  branch = "main"
): Promise<{ ok: boolean; message: string }> {
  return new Promise((resolve) => {
    const child = spawn("git", ["clone", "--depth", "1", "--branch", branch, repoUrl, targetDir], {
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stderr = "";
    let stdout = "";
    child.stdout?.on("data", (d: Buffer) => {
      stdout += d.toString();
    });
    child.stderr?.on("data", (d: Buffer) => {
      stderr += d.toString();
    });
    child.on("close", (code) => {
      if (code !== 0) {
        const msg = (stderr || stdout).trim();
        resolve({ ok: false, message: msg || "git clone failed" });
      } else {
        resolve({ ok: true, message: "ok" });
      }
    });
    child.on("error", (err: Error) => {
      resolve({ ok: false, message: err.message });
    });
  });
}

export function pull(targetDir: string): { ok: boolean; message: string } {
  const result = spawnSync("git", ["pull", "--ff-only"], {
    cwd: targetDir,
    encoding: "utf-8",
  });
  if (result.status !== 0) {
    const msg = (result.stderr || result.stdout || "").trim();
    return {
      ok: false,
      message: msg || "git pull failed",
    };
  }
  return { ok: true, message: "ok" };
}

export function pullAsync(targetDir: string): Promise<{ ok: boolean; message: string }> {
  return new Promise((resolve) => {
    const child = spawn("git", ["pull", "--ff-only"], {
      cwd: targetDir,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stderr = "";
    let stdout = "";
    child.stdout?.on("data", (d: Buffer) => {
      stdout += d.toString();
    });
    child.stderr?.on("data", (d: Buffer) => {
      stderr += d.toString();
    });
    child.on("close", (code) => {
      if (code !== 0) {
        const msg = (stderr || stdout).trim();
        resolve({ ok: false, message: msg || "git pull failed" });
      } else {
        resolve({ ok: true, message: "ok" });
      }
    });
    child.on("error", (err: Error) => {
      resolve({ ok: false, message: err.message });
    });
  });
}

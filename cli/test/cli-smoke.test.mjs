import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cliJs = path.join(__dirname, "..", "dist", "cli.js");

test("multistack --version prints semver and exits 0", () => {
  const r = spawnSync(process.execPath, [cliJs, "--version"], { encoding: "utf8" });
  assert.equal(r.status, 0);
  assert.match(r.stdout.trim(), /^\d+\.\d+\.\d+/);
});

test("multistack --help exits 0 and lists commands", () => {
  const r = spawnSync(process.execPath, [cliJs, "--help"], { encoding: "utf8" });
  assert.equal(r.status, 0);
  assert.match(r.stdout, /install/);
  assert.match(r.stdout, /multistack-skill-cli/);
});

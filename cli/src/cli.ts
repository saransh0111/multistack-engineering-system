import fs from "node:fs";
import path from "node:path";
import { program } from "commander";
import { cloneShallowAsync, gitAvailable, pullAsync } from "./git-ops.js";
import { withSpinner } from "./spinner.js";
import {
  getDefaultRepoUrl,
  getInstallRoot,
  hasSkillsTree,
  isGitRepo,
} from "./paths.js";
import type { MultistackPackage } from "./package-meta.js";
import {
  bannerHelpText,
  printAlreadyInstalled,
  printDoctorReport,
  printErrorBanner,
  printInstallIntro,
  printInstallSuccess,
  printListIntro,
  printUpdateSuccess,
} from "./ui.js";

const pkg = JSON.parse(
  fs.readFileSync(new URL("../package.json", import.meta.url), "utf-8")
) as MultistackPackage;

function die(msg: string): never {
  printErrorBanner(" multistack ", msg.trimEnd());
  process.exit(1);
}

program
  .name("multistack")
  .description("Install and manage multistack-engineering-system on your machine")
  .version(pkg.version);

program.addHelpText("before", bannerHelpText(pkg));

program
  .command("install")
  .description("Clone the skill pack into the global install directory (default: shallow clone of main)")
  .option("-r, --repo <url>", "Git repository URL", getDefaultRepoUrl())
  .option("-b, --branch <name>", "Branch to clone", "main")
  .action(async (opts: { repo: string; branch: string }) => {
    if (!gitAvailable()) {
      die("git not found in PATH.\nInstall Git, then retry.");
    }
    const root = getInstallRoot();
    if (fs.existsSync(root)) {
      if (isGitRepo(root) && hasSkillsTree(root)) {
        printAlreadyInstalled(root, pkg);
        return;
      }
      die(
        `Path exists but is not a valid install (expected git repo with skills/):\n${root}\nRemove it or set MULTISTACK_HOME to a different directory.`
      );
    }
    fs.mkdirSync(path.dirname(root), { recursive: true });
    printInstallIntro(opts.repo, opts.branch, pkg);
    const { ok, message } = await withSpinner("Cloning repository…", () =>
      cloneShallowAsync(opts.repo, root, opts.branch)
    );
    if (!ok) {
      die(`Install failed:\n${message}`);
    }
    printInstallSuccess(root);
  });

program
  .command("update")
  .description("Run git pull --ff-only in the install directory")
  .action(async () => {
    if (!gitAvailable()) {
      die("git not found in PATH.");
    }
    const root = getInstallRoot();
    if (!fs.existsSync(root) || !isGitRepo(root)) {
      die(`Not installed or not a git repo. Run: multistack install\n${root}`);
    }
    const { ok, message } = await withSpinner("Pulling latest changes…", () =>
      pullAsync(root)
    );
    if (!ok) {
      die(`Update failed:\n${message}`);
    }
    printUpdateSuccess(root);
  });

program
  .command("path")
  .description("Print the install root (use in Cursor @-references)")
  .option("--json", "Print {\"root\": \"...\"}")
  .action((opts: { json?: boolean }) => {
    const root = getInstallRoot();
    if (opts.json) {
      console.log(JSON.stringify({ root }, null, 0));
    } else {
      console.log(root);
    }
  });

program
  .command("skill <relative>")
  .description(
    "Print absolute path to a file under the install (e.g. cross-cutting/god-mode.skill or skills/cross-cutting/god-mode.skill)"
  )
  .action((relative: string) => {
    const root = getInstallRoot();
    let rel = relative.replace(/\\/g, "/").replace(/^\/+/, "");
    if (!rel.endsWith(".skill")) {
      die("Path must end with .skill");
    }
    if (!rel.startsWith("skills/")) {
      rel = path.posix.join("skills", rel);
    }
    const full = path.join(root, ...rel.split("/"));
    if (!fs.existsSync(full)) {
      die(
        `File not found:\n${full}\nInstall or update: multistack install | multistack update`
      );
    }
    console.log(full);
  });

program
  .command("list")
  .description("List skill domains (top-level folders under skills/)")
  .action(() => {
    const root = getInstallRoot();
    const skillsDir = path.join(root, "skills");
    if (!fs.existsSync(skillsDir)) {
      die(`skills/ not found. Run: multistack install\n${skillsDir}`);
    }
    printListIntro();
    const names = fs
      .readdirSync(skillsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort();
    for (const n of names) {
      console.log(`  ${"▸".padEnd(2)} ${n}`);
    }
    console.log();
  });

program
  .command("doctor")
  .description("Check Node, git, and install directory health")
  .action(() => {
    const root = getInstallRoot();
    const exists = fs.existsSync(root);
    printDoctorReport(
      process.version,
      gitAvailable(),
      process.env.MULTISTACK_HOME?.trim() || "(default)",
      root,
      exists,
      exists ? isGitRepo(root) : null,
      exists ? hasSkillsTree(root) : null,
      pkg
    );
  });

program.parse();

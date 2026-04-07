/** Fields read from `cli/package.json` for banners and `--help`. */
export type MultistackPackage = {
  name: string;
  version: string;
  author?: string;
  homepage?: string;
  repository?: { type?: string; url?: string };
};

export function normalizeRepoDisplayUrl(url: string): string {
  return url.replace(/^git\+/, "").replace(/\.git$/, "");
}

export function defaultRepoWebUrl(): string {
  return "https://github.com/saransh0111/multistack-engineering-system";
}

# Changelog

All notable changes to this project are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.1.1] - 2026-04-07

### Added

- CLI: `MULTISTACK_MINIMAL_BANNER=1` (or `true` / `yes`) skips the large banner art for narrow terminals or CI.
- CLI: help and install/doctor banners show package name, version, author, and repository URL from `package.json`.
- Smoke tests: `cd cli && npm test` (requires build).
- Root [README](README.md): npm version badge; [Changelog](CHANGELOG.md) linked from the table of contents.

### Changed

- Documentation: consolidated install story in the main README; `cli/README.md` points here.

## [0.1.0] - 2026-04-07

### Added

- Initial publish of **`multistack-skill-cli`** on npm: global command **`multistack`** with `install`, `update`, `path`, `skill`, `list`, and `doctor`.

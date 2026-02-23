# Terminal Button (Obsidian plugin)

Terminal Button adds a ribbon action and command that opens the current vault in a terminal app.

## Features

- Auto-detect desktop OS and use an OS-specific ribbon icon.
- Command: `Open current vault in terminal`.
- Ribbon action: open the current vault path in terminal.
- Settings for terminal app names on macOS, Windows, and Linux.
- Optional shared launch command (for example, `claude`) after terminal opens.

## Current platform support

- macOS: implemented
- Windows: settings UI only (launch not implemented yet)
- Linux: settings UI only (launch not implemented yet)

## Install for development

1. Clone this repository into your vault plugin folder:
   `VaultFolder/.obsidian/plugins/terminal-button/`
2. Install dependencies:
   `npm install`
3. Start watch build:
   `npm run dev`
4. In Obsidian, open **Settings -> Community plugins** and enable `Terminal Button`.

## Build

- Production build: `npm run build`
- Lint: `npm run lint`

## Manual install

Copy these files to:
`VaultFolder/.obsidian/plugins/terminal-button/`

- `main.js`
- `manifest.json`
- `styles.css` (if present)

## Release checklist

1. Update `manifest.json` version (SemVer).
2. Update `versions.json` with `"<plugin-version>": "<minAppVersion>"`.
3. Build with `npm run build`.
4. Create a GitHub release with tag exactly matching the version (no leading `v`).
5. Attach `manifest.json`, `main.js`, and `styles.css` (if present).

## Notes

- `manifest.json` plugin `id` is `terminal-button`.
- The plugin is desktop-only (`isDesktopOnly: true`).

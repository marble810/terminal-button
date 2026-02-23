# Terminal Button (Obsidian plugin)

Terminal Button adds a ribbon action and command that opens the current vault in a terminal app.

> [!IMPORTANT]
> Current release status: **Only macOS launch behavior is implemented**.
> Windows and Linux currently provide settings UI only (launch integration is not implemented yet).

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

## Icon Attribution

The three ribbon icons in this plugin are modified from Lucide's `square-terminal` icon.
Licensing: Lucide (ISC), with portions derived from Feather (MIT).

---

# Terminal Button（Obsidian 插件）- 简体中文

Terminal Button 提供一个侧边栏按钮和命令，用于在终端中打开当前 Vault。

> [!IMPORTANT]
> 当前版本状态：**仅实现了 macOS 的实际启动功能**。
> Windows 和 Linux 目前仅有设置界面，尚未实现终端启动能力。

## 功能

- 自动识别桌面系统，并使用对应系统的 Ribbon 图标。
- 命令：`Open current vault in terminal`。
- Ribbon 按钮：在终端中打开当前 Vault 路径。
- 可配置 macOS、Windows、Linux 的终端应用名称。
- 支持可选的共享启动命令（例如 `claude`），在终端打开后执行。

## 当前平台支持

- macOS：已实现（可实际拉起终端并打开 Vault）
- Windows：仅设置界面（尚未实现启动）
- Linux：仅设置界面（尚未实现启动）

## 开发安装

1. 将本仓库克隆到你的 Vault 插件目录：
   `VaultFolder/.obsidian/plugins/terminal-button/`
2. 安装依赖：
   `npm install`
3. 启动监听构建：
   `npm run dev`
4. 在 Obsidian 中打开 **Settings -> Community plugins** 并启用 `Terminal Button`。

## 构建

- 生产构建：`npm run build`
- 代码检查：`npm run lint`

## 手动安装

将以下文件复制到：
`VaultFolder/.obsidian/plugins/terminal-button/`

- `main.js`
- `manifest.json`
- `styles.css`（如果存在）

## 发布检查清单

1. 更新 `manifest.json` 中的版本号（SemVer）。
2. 在 `versions.json` 中添加 `"<plugin-version>": "<minAppVersion>"`。
3. 执行 `npm run build`。
4. 创建 GitHub Release，tag 必须与版本号完全一致（不要加 `v` 前缀）。
5. 上传 `manifest.json`、`main.js` 和 `styles.css`（如果存在）。

## 备注

- `manifest.json` 中插件 `id` 为 `terminal-button`。
- 插件仅支持桌面端（`isDesktopOnly: true`）。

## 图标声明

本插件的三个 Ribbon 图标基于 Lucide 的 `square-terminal` 图标修改而来。
许可证：Lucide（ISC），其中源自 Feather 的部分遵循 MIT。

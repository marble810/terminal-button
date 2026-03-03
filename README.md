<p align="center">
  <img src="https://github.com/marble810/terminal-button/blob/main/img/terminal-button.png?raw=true" alt="terminal-button readme banner"/>
</p>

# Terminal Button (Obsidian plugin)

Terminal Button adds a ribbon action and command that opens the current vault in a terminal app.

## Features

- Auto-detect desktop OS (Windows|macOS|Linux) and use an OS-specific ribbon icon.
- Command: `Open current vault in terminal`.
- Ribbon action: open the current vault path in terminal.
- Settings for terminal app names on macOS, Windows, and Linux.
- Settings UI language switch (Auto, English, 简体中文).
- Optional shared launch command (for example, `claude`) after terminal opens.

### Windows behavior notes

- Supported executable names: `wt.exe`, `pwsh.exe`, `powershell.exe`, `cmd.exe`.
- If `Launch command (optional, shared)` is set, it is applied for the executables above.
- For other terminal executables, the terminal is still opened at the vault directory, but the launch command is not injected automatically.

## Install with BRAT

You can install this plugin using [obsidian42-brat](https://github.com/TfTHacker/obsidian42-brat):

1. In Obsidian, install and enable **BRAT** from Community plugins.
2. Open **BRAT settings -> Add Beta plugin**.
3. Enter this repository URL: `https://github.com/marble810/terminal-button`
4. Confirm to install, then enable `Terminal Button` in Community plugins.

## Manual install

Copy these files to:
`VaultFolder/.obsidian/plugins/terminal-button/`

- `main.js`
- `manifest.json`
- `styles.css` (if present)

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
## Icon Attribution

The three ribbon icons in this plugin are modified from Lucide's `square-terminal` icon.
Licensing: Lucide (ISC), with portions derived from Feather (MIT).

---

# Terminal Button（Obsidian 插件）- 简体中文

Terminal Button 提供一个侧边栏按钮和命令，用于在终端中打开当前 Vault。

## 功能

- 自动识别桌面系统(Windows|macOS|Linux)，并使用对应系统的 Ribbon 图标。
- 命令：`Open current vault in terminal`。
- Ribbon 按钮：在终端中打开当前 Vault 路径。
- 可配置 macOS、Windows、Linux 的终端应用名称。
- 设置页支持语言切换（自动/English/简体中文）。
- 支持可选的共享启动命令（例如 `claude`），在终端打开后执行。

### Windows 行为说明

- 支持的可执行程序名：`wt.exe`、`pwsh.exe`、`powershell.exe`、`cmd.exe`。
- 若设置了 `Launch command (optional, shared)`，上述程序会自动执行该命令。
- 若填写其他终端可执行程序，仍会在 Vault 目录打开终端，但不会自动注入启动命令。

## 使用 BRAT 安装

你也可以通过 [obsidian42-brat](https://github.com/TfTHacker/obsidian42-brat) 安装本插件：

1. 在 Obsidian 的社区插件中安装并启用 **BRAT**。
2. 打开 **BRAT 设置 -> Add Beta plugin**。
3. 输入仓库地址：`https://github.com/marble810/terminal-button`
4. 确认安装后，在社区插件列表中启用 `Terminal Button`。

## 手动安装

将以下文件复制到：
`VaultFolder/.obsidian/plugins/terminal-button/`

- `main.js`
- `manifest.json`
- `styles.css`（如果存在）

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

## 图标声明

本插件的三个 Ribbon 图标基于 Lucide 的 `square-terminal` 图标修改而来。
许可证：Lucide（ISC），其中源自 Feather 的部分遵循 MIT。

import {App, PluginSettingTab, setIcon, Setting} from "obsidian";
import {type DesktopOS, getRibbonIconByOs} from "./icons/ribbon-icons";
import TerminalButton from "./main";

export type TerminalButtonSettings = {
	macOSTerminalApp: string;
	windowsTerminalApp: string;
	linuxTerminalApp: string;
	sharedToolCommand: string;
};

export const DEFAULT_SETTINGS: TerminalButtonSettings = {
	macOSTerminalApp: 'Terminal',
	windowsTerminalApp: 'wt.exe',
	linuxTerminalApp: 'x-terminal-emulator',
	sharedToolCommand: ''
};

const prependOsIconToSettingName = (setting: Setting, os: DesktopOS): void => {
	const iconEl = document.createElement('span');
	iconEl.classList.add('terminal-button-setting-os-icon');
	setIcon(iconEl, getRibbonIconByOs(os));
	setting.nameEl.prepend(iconEl);
};

export class TerminalButtonSettingsTab extends PluginSettingTab {
	plugin: TerminalButton;

	constructor(app: App, plugin: TerminalButton) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Current operating system')
			.setDesc(`Detected desktop OS: ${this.plugin.currentOs}`);

		containerEl.createEl('p', {
			cls: 'setting-item-description',
			text: 'Only settings for the current os can be edited. Settings for other os options are disabled.'
		});

		const macSetting = new Setting(containerEl)
			.setName('macOS terminal app')
			.setDesc('App name, bundle ID, or .app path used by `open -na`.')
			.addText((text) =>
				text
					.setPlaceholder('Terminal or /Applications/iTerm.app')
					.setValue(this.plugin.settings.macOSTerminalApp)
					.onChange(async (value) => {
						this.plugin.settings.macOSTerminalApp = value;
						await this.plugin.saveSettings();
					}))
			.addButton((button) =>
				button
					.setButtonText('Test')
					.setTooltip('Open the current vault path using this macOS terminal app setting.')
					.onClick(async () => {
						await this.plugin.openCurrentVaultInTerminal();
					}));
		macSetting.setDisabled(this.plugin.currentOs !== 'macos');
		prependOsIconToSettingName(macSetting, 'macos');

		const windowsSetting = new Setting(containerEl)
			.setName('Windows terminal app')
			.setDesc('Executable name or absolute path (for example, wt.exe, pwsh.exe, powershell.exe, cmd.exe).')
			.addText((text) =>
				text
					// eslint-disable-next-line obsidianmd/ui/sentence-case
					.setPlaceholder('wt.exe or pwsh.exe')
					.setValue(this.plugin.settings.windowsTerminalApp)
					.onChange(async (value) => {
						this.plugin.settings.windowsTerminalApp = value;
						await this.plugin.saveSettings();
					}))
			.addButton((button) =>
				button
					.setButtonText('Test')
					.setTooltip('Open the current vault path using this Windows terminal app setting.')
					.onClick(async () => {
						await this.plugin.openCurrentVaultInTerminal();
					}));
		windowsSetting.setDisabled(this.plugin.currentOs !== 'windows');
		prependOsIconToSettingName(windowsSetting, 'windows');

		const linuxSetting = new Setting(containerEl)
			.setName('Linux terminal app')
			// eslint-disable-next-line obsidianmd/ui/sentence-case
			.setDesc('Executable name or absolute path (for example, x-terminal-emulator, gnome-terminal, konsole).')
			.addText((text) =>
				text
					// eslint-disable-next-line obsidianmd/ui/sentence-case
					.setPlaceholder('x-terminal-emulator or gnome-terminal')
					.setValue(this.plugin.settings.linuxTerminalApp)
					.onChange(async (value) => {
						this.plugin.settings.linuxTerminalApp = value;
						await this.plugin.saveSettings();
					}))
			.addButton((button) =>
				button
					.setButtonText('Test')
					.setTooltip('Open the current vault path using this Linux terminal app setting.')
					.onClick(async () => {
						await this.plugin.openCurrentVaultInTerminal();
					}));
		linuxSetting.setDisabled(this.plugin.currentOs !== 'linux');
		prependOsIconToSettingName(linuxSetting, 'linux');

		new Setting(containerEl)
			.setName('Launch command (optional, shared)')
			.setDesc('Run this command after opening the terminal. Shared by macOS, Windows, and Linux.')
			.addText((text) =>
				text
					// eslint-disable-next-line obsidianmd/ui/sentence-case
					.setPlaceholder('claude')
					.setValue(this.plugin.settings.sharedToolCommand)
					.onChange(async (value) => {
						this.plugin.settings.sharedToolCommand = value;
						await this.plugin.saveSettings();
					}));

	}
}

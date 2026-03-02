import {App, Notice, PluginSettingTab, setIcon, Setting} from "obsidian";
import {type DesktopOS, getRibbonIconByOs} from "./icons/ribbon-icons";
import {getCurrentLanguage, isUiLanguageMode, t, type UiLanguageMode} from "./i18n";
import TerminalButton from "./main";

export type TerminalButtonSettings = {
	macOSTerminalApp: string;
	windowsTerminalApp: string;
	linuxTerminalApp: string;
	sharedToolCommand: string;
	uiLanguageMode: UiLanguageMode;
};

export const DEFAULT_SETTINGS: TerminalButtonSettings = {
	macOSTerminalApp: 'Terminal',
	windowsTerminalApp: 'wt.exe',
	linuxTerminalApp: 'x-terminal-emulator',
	sharedToolCommand: '',
	uiLanguageMode: 'auto'
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
		const language = getCurrentLanguage(this.plugin.settings.uiLanguageMode);

		containerEl.empty();

		new Setting(containerEl)
			.setName(t(language, 'settings.language.name'))
			.setDesc(t(language, 'settings.language.desc'))
			.addDropdown((dropdown) => {
				dropdown
					.addOption('auto', t(language, 'settings.language.option.auto'))
					.addOption('en', t(language, 'settings.language.option.en'))
					.addOption('zh-CN', t(language, 'settings.language.option.zh-CN'))
					.setValue(this.plugin.settings.uiLanguageMode)
					.onChange(async (value) => {
						if (!isUiLanguageMode(value)) {
							return;
						}
						this.plugin.settings.uiLanguageMode = value;
						await this.plugin.saveSettings();
						const nextLanguage = getCurrentLanguage(value);
						new Notice(t(nextLanguage, 'settings.language.changed'));
						this.display();
					});
			});

		const currentOsSetting = new Setting(containerEl)
			.setName(t(language, 'settings.currentOs.name'))
			.setDesc(t(language, 'settings.currentOs.desc', {os: this.plugin.currentOs}));

		const currentOsIconEl = currentOsSetting.controlEl.createSpan({
			cls: 'terminal-button-current-os-icon'
		});
		setIcon(currentOsIconEl, getRibbonIconByOs(this.plugin.currentOs));

		containerEl.createEl('p', {
			cls: 'setting-item-description',
			text: t(language, 'settings.osHint')
		});

		const macSetting = new Setting(containerEl)
			.setName(t(language, 'settings.macos.name'))
			.setDesc(t(language, 'settings.macos.desc'))
			.addText((text) =>
				text
					.setPlaceholder(t(language, 'settings.macos.placeholder'))
					.setValue(this.plugin.settings.macOSTerminalApp)
					.onChange(async (value) => {
						this.plugin.settings.macOSTerminalApp = value;
						await this.plugin.saveSettings();
					}))
			.addButton((button) =>
				button
					.setButtonText(t(language, 'settings.test.button'))
					.setTooltip(t(language, 'settings.test.tooltip'))
					.onClick(async () => {
						await this.plugin.openCurrentVaultInTerminal({showSuccessNotice: true});
					}));
		macSetting.setDisabled(this.plugin.currentOs !== 'macos');
		prependOsIconToSettingName(macSetting, 'macos');

		const windowsSetting = new Setting(containerEl)
			.setName(t(language, 'settings.windows.name'))
			.setDesc(t(language, 'settings.windows.desc'))
			.addText((text) =>
				text
					.setPlaceholder(t(language, 'settings.windows.placeholder'))
					.setValue(this.plugin.settings.windowsTerminalApp)
					.onChange(async (value) => {
						this.plugin.settings.windowsTerminalApp = value;
						await this.plugin.saveSettings();
					}))
			.addButton((button) =>
				button
					.setButtonText(t(language, 'settings.test.button'))
					.setTooltip(t(language, 'settings.test.tooltip'))
					.onClick(async () => {
						await this.plugin.openCurrentVaultInTerminal({showSuccessNotice: true});
					}));
		windowsSetting.setDisabled(this.plugin.currentOs !== 'windows');
		prependOsIconToSettingName(windowsSetting, 'windows');

		const linuxSetting = new Setting(containerEl)
			.setName(t(language, 'settings.linux.name'))
			.setDesc(t(language, 'settings.linux.desc'))
			.addText((text) =>
				text
					.setPlaceholder(t(language, 'settings.linux.placeholder'))
					.setValue(this.plugin.settings.linuxTerminalApp)
					.onChange(async (value) => {
						this.plugin.settings.linuxTerminalApp = value;
						await this.plugin.saveSettings();
					}))
			.addButton((button) =>
				button
					.setButtonText(t(language, 'settings.test.button'))
					.setTooltip(t(language, 'settings.test.tooltip'))
					.onClick(async () => {
						await this.plugin.openCurrentVaultInTerminal({showSuccessNotice: true});
					}));
		linuxSetting.setDisabled(this.plugin.currentOs !== 'linux');
		prependOsIconToSettingName(linuxSetting, 'linux');

		new Setting(containerEl)
			.setName(t(language, 'settings.command.name'))
			.setDesc(t(language, 'settings.command.desc'))
			.addText((text) =>
				text
					.setPlaceholder(t(language, 'settings.command.placeholder'))
					.setValue(this.plugin.settings.sharedToolCommand)
					.onChange(async (value) => {
						this.plugin.settings.sharedToolCommand = value;
						await this.plugin.saveSettings();
					}));

	}
}

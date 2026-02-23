/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {Notice, Plugin} from 'obsidian';
import {getRibbonIconByOs, registerTerminalButtonIcons, type DesktopOS} from './icons/ribbon-icons';
import {DEFAULT_SETTINGS, TerminalButtonSettings, TerminalButtonSettingsTab} from './settings';
import {openPathInMacOSTerminal} from './utils/macos-terminal';
import {getVaultAbsolutePath} from './utils/vault-path';

const OPEN_CURRENT_VAULT_COMMAND_ID = 'open-current-vault-in-terminal';

export default class TerminalButton extends Plugin {
	settings: TerminalButtonSettings = {...DEFAULT_SETTINGS};
	currentOs: DesktopOS = 'unknown';
	currentVaultPath: string | null = null;

	async onload() {
		await this.loadSettings();
		this.currentOs = this.detectCurrentOsDesktop();
		this.currentVaultPath = getVaultAbsolutePath(this.app);
		registerTerminalButtonIcons();
		const ribbonIcon = getRibbonIconByOs(this.currentOs);

		this.addCommand({
			id: OPEN_CURRENT_VAULT_COMMAND_ID,
			name: 'Open current vault in terminal',
			callback: () => {
				void this.openCurrentVaultInMacOSTerminal();
			}
		});

		this.addRibbonIcon(ribbonIcon, 'Open current vault in terminal', () => {
			void this.openCurrentVaultInMacOSTerminal();
		});

		this.addSettingTab(new TerminalButtonSettingsTab(this.app, this));
	}

	private detectCurrentOsDesktop(): DesktopOS {
		switch (process.platform) {
			case 'win32':
				return 'windows';
			case 'darwin':
				return 'macos';
			case 'linux':
				return 'linux';
			default:
				return 'unknown';
		}
	}

	async loadSettings(): Promise<void> {
		type LegacySettings = Partial<TerminalButtonSettings> & {
			macOSToolCommand?: string;
		};
		const data = (await this.loadData() as LegacySettings | null) ?? {};
		this.settings = {
			macOSTerminalApp: data.macOSTerminalApp ?? DEFAULT_SETTINGS.macOSTerminalApp,
			windowsTerminalApp: data.windowsTerminalApp ?? DEFAULT_SETTINGS.windowsTerminalApp,
			linuxTerminalApp: data.linuxTerminalApp ?? DEFAULT_SETTINGS.linuxTerminalApp,
			sharedToolCommand: data.sharedToolCommand ?? data.macOSToolCommand ?? DEFAULT_SETTINGS.sharedToolCommand
		};
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}

	async openCurrentVaultInMacOSTerminal(): Promise<void> {
		if (this.currentOs !== 'macos') {
			new Notice('Opening a terminal is currently supported on macOS only.');
			return;
		}

		const vaultPath = getVaultAbsolutePath(this.app);
		this.currentVaultPath = vaultPath;
		if (!vaultPath) {
			new Notice('Could not resolve the current vault path.');
			return;
		}

		try {
			await openPathInMacOSTerminal({
				terminalApp: this.settings.macOSTerminalApp,
				vaultPath,
				toolCommand: this.settings.sharedToolCommand
			});
		} catch (error) {
			console.error('[terminal-button] failed to open terminal:', error);
			new Notice('Failed to open terminal. Check the macOS terminal app setting.');
		}
	}
}

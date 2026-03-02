import {Notice, Plugin} from 'obsidian';
import {getRibbonIconByOs, registerTerminalButtonIcons, type DesktopOS} from './icons/ribbon-icons';
import {DEFAULT_SETTINGS, TerminalButtonSettings, TerminalButtonSettingsTab} from './settings';
import {openPathInLinuxTerminal} from './utils/linux-terminal';
import {openPathInMacOSTerminal} from './utils/macos-terminal';
import {getVaultAbsolutePath} from './utils/vault-path';
import {openPathInWindowsTerminal} from './utils/windows-terminal';

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
				void this.openCurrentVaultInTerminal();
			}
		});

		this.addRibbonIcon(ribbonIcon, 'Open current vault in terminal', () => {
			void this.openCurrentVaultInTerminal();
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
		const rawWindowsApp = data.windowsTerminalApp ?? DEFAULT_SETTINGS.windowsTerminalApp;
		const shouldMigrateWindowsApp =
			rawWindowsApp.trim().toLowerCase() === 'windows terminal';
		const windowsTerminalApp = shouldMigrateWindowsApp ? DEFAULT_SETTINGS.windowsTerminalApp : rawWindowsApp;
		this.settings = {
			macOSTerminalApp: data.macOSTerminalApp ?? DEFAULT_SETTINGS.macOSTerminalApp,
			windowsTerminalApp,
			linuxTerminalApp: data.linuxTerminalApp ?? DEFAULT_SETTINGS.linuxTerminalApp,
			sharedToolCommand: data.sharedToolCommand ?? data.macOSToolCommand ?? DEFAULT_SETTINGS.sharedToolCommand
		};

		if (shouldMigrateWindowsApp) {
			await this.saveSettings();
		}
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}

	async openCurrentVaultInTerminal(): Promise<void> {
		const vaultPath = getVaultAbsolutePath(this.app);
		this.currentVaultPath = vaultPath;
		if (!vaultPath) {
			new Notice('Could not resolve the current vault path.');
			return;
		}

		switch (this.currentOs) {
			case 'macos':
				try {
					await openPathInMacOSTerminal({
						terminalApp: this.settings.macOSTerminalApp,
						vaultPath,
						toolCommand: this.settings.sharedToolCommand
					});
				} catch (error) {
					console.error('[terminal-button] failed to open macOS terminal:', error);
					new Notice('Failed to open terminal. Check the macOS terminal app setting.');
				}
				return;
			case 'windows':
				try {
					const result = await openPathInWindowsTerminal({
						terminalApp: this.settings.windowsTerminalApp,
						vaultPath,
						toolCommand: this.settings.sharedToolCommand
					});
					if (this.settings.sharedToolCommand.trim() && !result.toolCommandApplied) {
						new Notice('Opened terminal, but the launch command was not applied for this terminal app.');
					}
				} catch (error) {
					console.error('[terminal-button] failed to open Windows terminal:', error);
					new Notice('Failed to open terminal. Check the Windows terminal app setting.');
				}
				return;
			case 'linux':
				try {
					const result = await openPathInLinuxTerminal({
						terminalApp: this.settings.linuxTerminalApp,
						vaultPath,
						toolCommand: this.settings.sharedToolCommand
					});
					if (this.settings.sharedToolCommand.trim() && !result.toolCommandApplied) {
						new Notice('Opened terminal, but the launch command was not applied for this terminal app.');
					}
				} catch (error) {
					console.error('[terminal-button] failed to open Linux terminal:', error);
					new Notice('Failed to open terminal. Check the Linux terminal app setting.');
				}
				return;
			default:
				new Notice('Opening a terminal is currently supported on macOS, Windows, and Linux.');
		}
	}
}

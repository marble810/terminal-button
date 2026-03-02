import {moment} from 'obsidian';

export type UiLanguageMode = 'auto' | 'en' | 'zh-CN';
export type UiLanguage = 'en' | 'zh-CN';

export const isUiLanguageMode = (value: string): value is UiLanguageMode =>
	value === 'auto' || value === 'en' || value === 'zh-CN';

export const resolveLanguage = (mode: UiLanguageMode, locale: string): UiLanguage => {
	if (mode === 'en' || mode === 'zh-CN') {
		return mode;
	}

	return locale.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
};

export const getCurrentLanguage = (mode: UiLanguageMode): UiLanguage =>
	resolveLanguage(mode, moment.locale());

export type TranslationKey =
	| 'settings.language.name'
	| 'settings.language.desc'
	| 'settings.language.option.auto'
	| 'settings.language.option.en'
	| 'settings.language.option.zh-CN'
	| 'settings.language.changed'
	| 'settings.currentOs.name'
	| 'settings.currentOs.desc'
	| 'settings.osHint'
	| 'settings.macos.name'
	| 'settings.macos.desc'
	| 'settings.macos.placeholder'
	| 'settings.windows.name'
	| 'settings.windows.desc'
	| 'settings.windows.placeholder'
	| 'settings.linux.name'
	| 'settings.linux.desc'
	| 'settings.linux.placeholder'
	| 'settings.command.name'
	| 'settings.command.desc'
	| 'settings.command.placeholder'
	| 'settings.test.button'
	| 'settings.test.tooltip'
	| 'notice.vaultPathNotResolved'
	| 'notice.openFailed.macos'
	| 'notice.openFailed.windows'
	| 'notice.openFailed.linux'
	| 'notice.toolCommandNotApplied'
	| 'notice.unsupportedOs'
	| 'notice.testSuccess';

const MESSAGES: Record<UiLanguage, Record<TranslationKey, string>> = {
	en: {
		'settings.language.name': 'Interface language',
		'settings.language.desc': 'Choose how text is shown in this settings page.',
		'settings.language.option.auto': 'Auto (System)',
		'settings.language.option.en': 'English',
		'settings.language.option.zh-CN': '简体中文',
		'settings.language.changed': 'Language updated.',
		'settings.currentOs.name': 'This device',
		'settings.currentOs.desc': 'Detected system: {os}',
		'settings.osHint': 'To avoid mistakes, only settings for your current system can be edited.',
		'settings.macos.name': 'macOS terminal',
		'settings.macos.desc': 'Pick the terminal app you want to open on macOS.',
		'settings.macos.placeholder': 'e.g. Terminal or iTerm',
		'settings.windows.name': 'Windows terminal',
		'settings.windows.desc': 'Pick the terminal app you want to open on Windows.',
		'settings.windows.placeholder': 'e.g. Windows Terminal or PowerShell',
		'settings.linux.name': 'Linux terminal',
		'settings.linux.desc': 'Pick the terminal app you want to open on Linux.',
		'settings.linux.placeholder': 'e.g. x-terminal-emulator or gnome-terminal',
		'settings.command.name': 'Run after opening (optional)',
		'settings.command.desc': 'If set, this command runs automatically after the terminal opens.',
		'settings.command.placeholder': 'e.g. claude',
		'settings.test.button': 'Test',
		'settings.test.tooltip': 'Open terminal once with this setting.',
		'notice.vaultPathNotResolved': 'Could not resolve the current vault path.',
		'notice.openFailed.macos': 'Failed to open terminal. Check the macOS terminal app setting.',
		'notice.openFailed.windows': 'Failed to open terminal. Check the Windows terminal app setting.',
		'notice.openFailed.linux': 'Failed to open terminal. Check the Linux terminal app setting.',
		'notice.toolCommandNotApplied':
			'Opened terminal, but the launch command was not applied for this terminal app.',
		'notice.unsupportedOs': 'Opening a terminal is currently supported on macOS, Windows, and Linux.',
		'notice.testSuccess': 'Terminal opened.'
	},
	'zh-CN': {
		'settings.language.name': '界面语言',
		'settings.language.desc': '选择此设置页的显示语言。',
		'settings.language.option.auto': '自动（跟随系统）',
		'settings.language.option.en': 'English',
		'settings.language.option.zh-CN': '简体中文',
		'settings.language.changed': '语言已更新。',
		'settings.currentOs.name': '当前设备',
		'settings.currentOs.desc': '已识别系统：{os}',
		'settings.osHint': '为避免误操作，仅当前系统的设置可编辑。',
		'settings.macos.name': 'macOS 终端',
		'settings.macos.desc': '选择在 macOS 上要打开的终端应用。',
		'settings.macos.placeholder': '例如：Terminal 或 iTerm',
		'settings.windows.name': 'Windows 终端',
		'settings.windows.desc': '选择在 Windows 上要打开的终端应用。',
		'settings.windows.placeholder': '例如：Windows Terminal 或 PowerShell',
		'settings.linux.name': 'Linux 终端',
		'settings.linux.desc': '选择在 Linux 上要打开的终端应用。',
		'settings.linux.placeholder': '例如：x-terminal-emulator 或 gnome-terminal',
		'settings.command.name': '打开后自动执行（可选）',
		'settings.command.desc': '填写后，终端打开后会自动运行这条命令。',
		'settings.command.placeholder': '例如：claude',
		'settings.test.button': '测试',
		'settings.test.tooltip': '用当前设置打开一次终端。',
		'notice.vaultPathNotResolved': '无法解析当前 Vault 路径。',
		'notice.openFailed.macos': '打开终端失败，请检查 macOS 终端应用设置。',
		'notice.openFailed.windows': '打开终端失败，请检查 Windows 终端应用设置。',
		'notice.openFailed.linux': '打开终端失败，请检查 Linux 终端应用设置。',
		'notice.toolCommandNotApplied': '终端已打开，但该终端应用未自动执行启动命令。',
		'notice.unsupportedOs': '当前仅支持在 macOS、Windows 和 Linux 上打开终端。',
		'notice.testSuccess': '终端已打开。'
	}
};

export const t = (
	language: UiLanguage,
	key: TranslationKey,
	vars?: Record<string, string>
): string => {
	const template = MESSAGES[language][key] ?? MESSAGES.en[key];
	if (!vars) {
		return template;
	}

	return template.replace(/\{(\w+)\}/g, (match: string, token: string) => vars[token] ?? match);
};

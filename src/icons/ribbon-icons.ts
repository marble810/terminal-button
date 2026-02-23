import {addIcon} from 'obsidian';
import ribbonLinuxSvg from '../assets/icons/ribbon-linux.svg';
import ribbonMacosSvg from '../assets/icons/ribbon-macos.svg';
import ribbonWindowsSvg from '../assets/icons/ribbon-windows.svg';

export type DesktopOS = 'windows' | 'macos' | 'linux' | 'unknown';

const MACOS_ICON_ID = 'terminal-button-ribbon-macos';
const WINDOWS_ICON_ID = 'terminal-button-ribbon-windows';
const LINUX_ICON_ID = 'terminal-button-ribbon-linux';
const FALLBACK_ICON_ID = 'terminal';

let iconsRegistered = false;

export const registerTerminalButtonIcons = (): void => {
	if (iconsRegistered) {
		return;
	}

	addIcon(MACOS_ICON_ID, ribbonMacosSvg);
	addIcon(WINDOWS_ICON_ID, ribbonWindowsSvg);
	addIcon(LINUX_ICON_ID, ribbonLinuxSvg);
	iconsRegistered = true;
};

export const getRibbonIconByOs = (os: DesktopOS): string => {
	switch (os) {
		case 'macos':
			return MACOS_ICON_ID;
		case 'windows':
			return WINDOWS_ICON_ID;
		case 'linux':
			return LINUX_ICON_ID;
		default:
			return FALLBACK_ICON_ID;
	}
};

import {spawn} from 'child_process';
import path from 'path';

export type OpenLinuxTerminalOptions = {
	terminalApp: string;
	vaultPath: string;
	toolCommand?: string;
};

export type OpenLinuxTerminalResult = {
	toolCommandApplied: boolean;
};

type LinuxLaunchSpec = {
	file: string;
	args: string[];
	toolCommandApplied: boolean;
};

const sanitizeExecutable = (value: string): string => value.trim();

const sanitizeToolCommand = (value?: string): string | undefined => {
	const trimmed = value?.trim();
	return trimmed ? trimmed : undefined;
};

const normalizeExecutableName = (executable: string): string =>
	path.basename(executable).toLowerCase();

const buildInteractiveShellCommand = (toolCommand: string): string =>
	`${toolCommand}; exec "\${SHELL:-bash}"`;

const buildLaunchSpec = (
	executable: string,
	vaultPath: string,
	toolCommand?: string
): LinuxLaunchSpec => {
	const normalizedName = normalizeExecutableName(executable);
	const shellCommand = toolCommand ? buildInteractiveShellCommand(toolCommand) : undefined;

	if (normalizedName === 'x-terminal-emulator') {
		if (shellCommand) {
			return {
				file: executable,
				args: ['-e', 'bash', '-lc', `cd -- "${vaultPath}" && ${shellCommand}`],
				toolCommandApplied: true
			};
		}
		return {
			file: executable,
			args: ['--working-directory', vaultPath],
			toolCommandApplied: false
		};
	}

	if (normalizedName === 'gnome-terminal' || normalizedName === 'kgx' || normalizedName === 'ptyxis') {
		if (shellCommand) {
			return {
				file: executable,
				args: ['--working-directory', vaultPath, '--', 'bash', '-lc', shellCommand],
				toolCommandApplied: true
			};
		}
		return {
			file: executable,
			args: ['--working-directory', vaultPath],
			toolCommandApplied: false
		};
	}

	if (normalizedName === 'konsole') {
		if (shellCommand) {
			return {
				file: executable,
				args: ['--workdir', vaultPath, '-e', 'bash', '-lc', shellCommand],
				toolCommandApplied: true
			};
		}
		return {
			file: executable,
			args: ['--workdir', vaultPath],
			toolCommandApplied: false
		};
	}

	if (normalizedName === 'alacritty') {
		if (shellCommand) {
			return {
				file: executable,
				args: ['--working-directory', vaultPath, '-e', 'bash', '-lc', shellCommand],
				toolCommandApplied: true
			};
		}
		return {
			file: executable,
			args: ['--working-directory', vaultPath],
			toolCommandApplied: false
		};
	}

	if (normalizedName === 'kitty') {
		if (shellCommand) {
			return {
				file: executable,
				args: ['--directory', vaultPath, 'bash', '-lc', shellCommand],
				toolCommandApplied: true
			};
		}
		return {
			file: executable,
			args: ['--directory', vaultPath],
			toolCommandApplied: false
		};
	}

	if (normalizedName === 'wezterm') {
		if (shellCommand) {
			return {
				file: executable,
				args: ['start', '--cwd', vaultPath, '--', 'bash', '-lc', shellCommand],
				toolCommandApplied: true
			};
		}
		return {
			file: executable,
			args: ['start', '--cwd', vaultPath],
			toolCommandApplied: false
		};
	}

	return {
		file: executable,
		args: [],
		toolCommandApplied: false
	};
};

const executeDetached = async (file: string, args: string[], cwd: string): Promise<void> => {
	await new Promise<void>((resolve, reject) => {
		const child = spawn(file, args, {
			cwd,
			detached: true,
			stdio: 'ignore'
		});
		child.on('error', reject);
		child.on('spawn', () => resolve());
		child.unref();
	});
};

export const openPathInLinuxTerminal = async ({
	terminalApp,
	vaultPath,
	toolCommand
}: OpenLinuxTerminalOptions): Promise<OpenLinuxTerminalResult> => {
	const executable = sanitizeExecutable(terminalApp);
	if (!executable) {
		throw new Error('Linux terminal app is empty');
	}

	const launchSpec = buildLaunchSpec(executable, vaultPath, sanitizeToolCommand(toolCommand));
	await executeDetached(launchSpec.file, launchSpec.args, vaultPath);
	return {toolCommandApplied: launchSpec.toolCommandApplied};
};

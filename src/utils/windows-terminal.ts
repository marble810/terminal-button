import {spawn} from 'child_process';
import path from 'path';

export type OpenWindowsTerminalOptions = {
	terminalApp: string;
	vaultPath: string;
	toolCommand?: string;
};

export type OpenWindowsTerminalResult = {
	toolCommandApplied: boolean;
};

type WindowsLaunchSpec = {
	file: string;
	args: string[];
	toolCommandApplied: boolean;
};

const sanitizeExecutable = (value: string): string => value.trim();

const sanitizeToolCommand = (value?: string): string | undefined => {
	const trimmed = value?.trim();
	return trimmed ? trimmed : undefined;
};

const normalizeExecutableName = (executable: string): string => {
	const baseName = path.basename(executable).toLowerCase();
	return baseName.endsWith('.exe') ? baseName.slice(0, -4) : baseName;
};

const toPowerShellLiteral = (value: string): string => `'${value.replace(/'/g, "''")}'`;

const toCmdQuoted = (value: string): string => `"${value.replace(/"/g, '""')}"`;

const buildLaunchSpec = (
	executable: string,
	vaultPath: string,
	toolCommand?: string
): WindowsLaunchSpec => {
	const normalizedName = normalizeExecutableName(executable);

	if (normalizedName === 'wt') {
		if (!toolCommand) {
			return {
				file: executable,
				args: ['-d', vaultPath],
				toolCommandApplied: false
			};
		}

		return {
			file: executable,
			args: ['-d', vaultPath, 'cmd', '/k', toolCommand],
			toolCommandApplied: true
		};
	}

	if (normalizedName === 'powershell' || normalizedName === 'pwsh') {
		const script = toolCommand
			? `Set-Location -LiteralPath ${toPowerShellLiteral(vaultPath)}; ${toolCommand}`
			: `Set-Location -LiteralPath ${toPowerShellLiteral(vaultPath)}`;
		return {
			file: executable,
			args: ['-NoExit', '-Command', script],
			toolCommandApplied: Boolean(toolCommand)
		};
	}

	if (normalizedName === 'cmd') {
		const command = toolCommand
			? `cd /d ${toCmdQuoted(vaultPath)} && ${toolCommand}`
			: `cd /d ${toCmdQuoted(vaultPath)}`;
		return {
			file: executable,
			args: ['/k', command],
			toolCommandApplied: Boolean(toolCommand)
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

export const openPathInWindowsTerminal = async ({
	terminalApp,
	vaultPath,
	toolCommand
}: OpenWindowsTerminalOptions): Promise<OpenWindowsTerminalResult> => {
	const executable = sanitizeExecutable(terminalApp);
	if (!executable) {
		throw new Error('Windows terminal app is empty');
	}

	const launchSpec = buildLaunchSpec(executable, vaultPath, sanitizeToolCommand(toolCommand));
	await executeDetached(launchSpec.file, launchSpec.args, vaultPath);
	return {toolCommandApplied: launchSpec.toolCommandApplied};
};

import {spawn} from 'child_process';
import {mkdtempSync, rmSync, writeFileSync} from 'fs';
import {tmpdir} from 'os';
import {join} from 'path';

export type LaunchCommand = {
	command: string;
	cleanup?: () => void;
};

export type OpenMacOSTerminalOptions = {
	terminalApp: string;
	vaultPath: string;
	toolCommand?: string;
};

export const TEMP_SCRIPT_CLEANUP_DELAY_MS = 30_000;

const sanitizeTerminalApp = (value: string): string => value.trim();

const sanitizeToolCommand = (value?: string): string | undefined => {
	const trimmed = value?.trim();
	return trimmed ? trimmed : undefined;
};

const escapeDoubleQuotes = (value: string): string => value.replace(/"/g, '\\"');

const ensureTempScript = (content: string): {path: string; cleanup: () => void} => {
	const dir = mkdtempSync(join(tmpdir(), 'terminal-button-'));
	const filePath = join(dir, 'launch.command');
	writeFileSync(filePath, content, {mode: 0o755});

	const cleanup = () => {
		rmSync(dir, {recursive: true, force: true});
	};

	return {path: filePath, cleanup};
};

const buildMacLaunch = (
	terminalApp: string,
	vaultPath: string,
	toolCommand?: string
): LaunchCommand | null => {
	const app = sanitizeTerminalApp(terminalApp);
	if (!app) {
		return null;
	}

	const escapedApp = escapeDoubleQuotes(app);
	const escapedPath = escapeDoubleQuotes(vaultPath);
	if (!toolCommand) {
		return {command: `open -na "${escapedApp}" "${escapedPath}"`};
	}

	const scriptLines = [
		'#!/bin/bash',
		`cd "${escapedPath}"`,
		toolCommand,
		'exec "$SHELL"'
	];
	const {path, cleanup} = ensureTempScript(scriptLines.join('\n'));
	const escapedScriptPath = escapeDoubleQuotes(path);
	return {
		command: `open -na "${escapedApp}" "${escapedScriptPath}"`,
		cleanup
	};
};

const executeShellCommand = async (command: string, cwd: string): Promise<void> => {
	await new Promise<void>((resolve, reject) => {
		const child = spawn(command, {
			cwd,
			shell: true,
			detached: true,
			stdio: 'ignore'
		});
		child.on('error', reject);
		child.on('close', (code) => {
			if (code === 0) {
				resolve();
				return;
			}
			reject(new Error(`open exited with code ${String(code)}`));
		});
		child.unref();
	});
};

export const openPathInMacOSTerminal = async ({
	terminalApp,
	vaultPath,
	toolCommand
}: OpenMacOSTerminalOptions): Promise<void> => {
	const launchCommand = buildMacLaunch(terminalApp, vaultPath, sanitizeToolCommand(toolCommand));
	if (!launchCommand) {
		throw new Error('macOS terminal app is empty');
	}

	try {
		await executeShellCommand(launchCommand.command, vaultPath);
	} finally {
		if (launchCommand.cleanup) {
			window.setTimeout(() => {
				try {
					launchCommand.cleanup?.();
				} catch (error) {
					console.warn('[terminal-button] Failed to clean temporary script', error);
				}
			}, TEMP_SCRIPT_CLEANUP_DELAY_MS);
		}
	}
};

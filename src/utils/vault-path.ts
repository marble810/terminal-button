import {App, FileSystemAdapter} from 'obsidian';

export function getVaultAbsolutePath(app: App): string | null {
	const adapter = app.vault.adapter;
	if (adapter instanceof FileSystemAdapter) {
		return adapter.getBasePath();
	}

	return null;
}

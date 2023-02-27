import { ipcMain, BrowserWindow } from 'electron';
import Store from 'electron-store';

export function saveGlutoesKey(window: BrowserWindow) {
  const store = new Store();

  ipcMain.on('SAVE_GLUTOES_KEY', async (event, arg) => {
    store.set('glutoes-key', arg[0]);
    window?.reload();
  });
}

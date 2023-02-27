import { ipcMain, BrowserWindow, shell } from 'electron';

export function toggleWindow(window: BrowserWindow) {
  ipcMain.on('TOGGLE_WINDOW', async (event, arg) => {
    if (arg.length) {
      if (arg[0]) {
        return window.show();
      }
      return window.hide();
    }
    if (window.isVisible()) return window.hide();
    window.show();
  });
}

export function openExternal() {
  ipcMain.on('OPEN_EXTERNAL', async (event, arg) => {
    shell.openExternal(arg[0]);
  });
}

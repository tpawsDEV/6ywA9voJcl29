/* eslint global-require: off, no-console: off, promise/always-return: off */

import AppUpdater from './updater';
import { app, Tray, Menu } from 'electron';
import { saveGlutoesKey } from './listeners/glutoesKey';
import { logIn, qrUpdate, sendWppMessage } from './listeners/whatsapp';
import { getAssetPath } from './util';
import TrayWindow from './windows/tray';
import WhatsappWindow from './windows/whatsapp';
import { clearServiceWorkers } from './helpers/whatsapp';
import { openExternal, toggleWindow } from './listeners/window';
import { segment } from 'functions/whatsapp';

let trayWindow: any | TrayWindow;
let mainTray: Tray;
let whatsappWindow: any | TrayWindow;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  // require('electron-debug')();
}

const createTray = () => {
  mainTray = new Tray(getAssetPath('icon.png'));
  mainTray.setToolTip('Glutões');
  mainTray.setTitle('This is my title');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Ver Campanhas',
      click() {
        trayWindow.window.show();
      },
    },
  ]);
  mainTray.setContextMenu(contextMenu);
};

/**
 * Add event listeners...
 */
app.setLoginItemSettings({
  openAtLogin: true,
  path: app.getPath('exe'),
});
app
  .whenReady()
  .then(() => {
    trayWindow = new TrayWindow();
    whatsappWindow = new WhatsappWindow();
    new AppUpdater();

    createTray();

    saveGlutoesKey(trayWindow.window);
    qrUpdate(trayWindow.window);
    sendWppMessage(whatsappWindow.window);
    toggleWindow(trayWindow.window);
    openExternal();
    logIn(trayWindow.window);
  })
  .catch(console.log);

app.on('before-quit', clearServiceWorkers);

import { BrowserWindow, session } from 'electron';
import { getAssetPath, getPreloadPath } from '../util';
import MenuBuilder from '../menu';
import Store from 'electron-store';

class WhatsappWindow {
  window: BrowserWindow;
  constructor() {
    const store = new Store();

    // require('electron-debug')();

    this.window = new BrowserWindow({
      show: false,
      width: 800,
      height: 800,
      icon: getAssetPath('icon.png'),
      // frame: false,
      resizable: false,
      webPreferences: {
        // contextIsolation: false,
        nodeIntegration: true,
        // nodeIntegrationInWorker: true,
        allowRunningInsecureContent: true,

        webSecurity: false,
        devTools: true,
        preload: getPreloadPath(),
      },
    });

    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': ['*'],
        },
      });
    });

    const userAgent =
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.131 Safari/537.36';

    this.window.loadURL('https://web.whatsapp.com/', { userAgent });

    this.window.on('ready-to-show', () => {
      if (!this.window) {
        throw new Error('"mainWindow" is not defined');
      }
    });

    this.window.on('close', (event) => {
      event.preventDefault();
      this.window.hide();
      return false;
    });

    // this.window.show();

    const menuBuilder = new MenuBuilder(this.window);
    menuBuilder.buildMenu();

    // this.window.webContents.toggleDevTools();
    const glutoesKey = store.get('glutoes-key');
    this.window.webContents.send('SAVE_GLUTOES_KEY', glutoesKey);
    this.window.webContents.setAudioMuted(true);
    // Remove this if your app does not use auto updates
    // eslint-disable-next-line
  }

  public destructor() {
    this.window.destroy();
  }
}

export default WhatsappWindow;

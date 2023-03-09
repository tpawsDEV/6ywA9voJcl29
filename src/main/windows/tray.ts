import { BrowserWindow, screen } from 'electron';
import { getAssetPath, getPreloadPath, resolveHtmlPath } from '../util';
import Store from 'electron-store';
import MenuBuilder from '../menu';
import { segment } from '../../functions/whatsapp';

class TrayWindow {
  window: BrowserWindow;
  constructor() {
    const store = new Store();
    // require('electron-debug')();
    let display = screen.getPrimaryDisplay();
    let width = display.bounds.width;
    let height = display.bounds.height;

    this.window = new BrowserWindow({
      show: false,
      x: width - 300,
      y: 0,
      width: 300,
      height: height,
      icon: getAssetPath('icon.png'),
      frame: false,
      resizable: false,
      webPreferences: {
        preload: getPreloadPath(),
        devTools: true,
      },
    });

    this.window.loadURL(resolveHtmlPath('index.html'));

    this.window.on('ready-to-show', () => {
      if (!this.window) {
        throw new Error('"mainWindow" is not defined');
      }

      const glutoesKey = store.get('glutoes-key');
      this.window.webContents.send('SAVE_GLUTOES_KEY', glutoesKey);
      // this.window.webContents.toggleDevTools();

      if (!glutoesKey) {
        this.window.show();
      } else {
        // segment(glutoesKey as string, this.window)
      }
    });
  }

  public destructor() {
    this.window.destroy();
  }
}

export default TrayWindow;

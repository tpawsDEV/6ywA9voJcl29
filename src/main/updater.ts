import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import path from 'path';

class AppUpdater {
  constructor() {
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
    log.transports.file.resolvePath = () => path.join(__dirname, '/logsmain.log');

    log.log('VERSIONING 4.6.5');
    autoUpdater.on('checking-for-update', () => {
      log.log('checking-for-update');
    });
    autoUpdater.on('update-available', () => {
      log.log('update-available');
    });
    autoUpdater.on('download-progress', () => {
      log.log('download-progress');
    });
    autoUpdater.on('update-cancelled', () => {
      log.log('update-cancelled');
    });
    autoUpdater.on('update-downloaded', () => {
      log.log('update-downloaded');
    });
    autoUpdater.on('update-not-available', () => {
      log.log('update-not-available');
    });
    autoUpdater.on('error', () => {
      log.log('error');
    });
  }
}

export default AppUpdater;

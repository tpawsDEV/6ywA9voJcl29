import { ipcMain, BrowserWindow } from 'electron';

export function qrUpdate(window: BrowserWindow) {
  ipcMain.on('QR_UPDATE', async (event, arg) => {
    window.webContents.send('QR_UPDATE', arg[0]);
    window.show();
  });
}

export function logIn(window: BrowserWindow) {
  ipcMain.on('WPP_LOG_IN', async (event, arg) => {
    window.webContents.send('WPP_LOG_IN', arg[0]);
  });
}

export function sendWppMessage(window: BrowserWindow) {
  ipcMain.on('SEND_WPP_MESSAGE', async (event, arg) => {
    window.webContents.send('SEND_WPP_MESSAGE', arg);
  });
}

export function segmentContacts(restaurantId: string, window: BrowserWindow) {
  ipcMain.on('RECEIVE_WPP_CONTACTS', async (event, arg) => {
    const contacts = arg[0];
    fetch('https://newmkt.glutoes.com/contacts/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contacts: contacts,
        origin: 'Whatsapp',
        store_id: restaurantId,
      }),
    });
  });
}

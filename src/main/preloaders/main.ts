import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { WhatsappEvents } from './whatsapp/events';

export type Channels = 'SAVE_GLUTOES_KEY' | 'QR_UPDATE' | 'WPP_LOG_IN' | "SEND_WPP_MESSAGE" | "TOGGLE_WINDOW" | "OPEN_EXTERNAL" | "window";

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription: any = (
        _event: IpcRendererEvent,
        ...args: unknown[]
      ) => func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};
contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;

// WHATSAPP
WhatsappEvents(ipcRenderer);

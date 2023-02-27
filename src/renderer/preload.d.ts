import { ElectronHandler } from '../main/preloaders/main';

declare global {
  interface Window {
    electron: ElectronHandler;
  }
}

export {};

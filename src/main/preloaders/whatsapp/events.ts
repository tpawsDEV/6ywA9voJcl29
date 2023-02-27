import { clearContacts, segment, sendMessage } from 'functions/whatsapp';
import Inject from './inject';

const WhatsappEvents = async (ipcRenderer: any) => {
  if (document.location.href !== 'https://web.whatsapp.com/') {
    return null;
  }

  try {
    (function () {
      Notification = function () {} as any;
    })();
  } catch (error) {}

  const header = document.querySelector('head');
  header?.insertAdjacentHTML(
    'beforeend',
    `<meta http-equiv="Content-Security-Policy" content="default-src 'unsafe-inline' 'unsafe-eval' 'self' * data: * blob: *;script-src 'unsafe-inline' 'unsafe-eval' 'self' * data: * blob: *;style-src 'unsafe-inline' 'unsafe-eval' 'self' * data: * blob: *;connect-src 'unsafe-inline' 'unsafe-eval' 'self' * data: * blob: *;font-src 'unsafe-inline' 'unsafe-eval' 'self' * data: * blob: *;img-src 'unsafe-inline' 'unsafe-eval' 'self' * data: * blob: *;media-src 'unsafe-inline' 'unsafe-eval' 'self' * data: * blob: *;child-src 'unsafe-inline' 'unsafe-eval' 'self' * data: * blob: *;frame-src 'unsafe-inline' 'unsafe-eval' 'self' * data: * blob: *">
  `
  );
  ipcRenderer.once('SEND_WPP_MESSAGE', async (event: any, arg: any) => {
    sendMessage(arg[0], arg[1], arg[2]);
  });

  ipcRenderer.once('SAVE_GLUTOES_KEY', async (event: any, arg: any) => {
    console.log(event);
    // segment(event);
  });

  ipcRenderer.once('CAN_SEGMENT', async (event: any, arg: any) => {
    (window as any).getContacts();
  });

  const INTRO_IMG_SELECTOR =
    '[data-testid="intro-md-beta-logo-dark"], [data-testid="intro-md-beta-logo-light"], [data-asset-intro-image-light="true"], [data-asset-intro-image-dark="true"]';
  const INTRO_QRCODE_SELECTOR = 'div[data-ref] canvas';

  const waitForSelector = async (selector: string, options: any) => {
    const maxTries = options.timeout / 200;
    let trier = 0;
    let element = document.querySelector(selector);

    while (!element && trier < maxTries) {
      await new Promise((r) => setTimeout(r, 200));
      trier += 1;
      element = document.querySelector(selector);
    }
    return element;
  };

  let needAuthentication = await Promise.race([
    new Promise((resolve) => {
      waitForSelector(INTRO_IMG_SELECTOR, { timeout: 5000 })
        .then(() => resolve(false))
        .catch((err) => resolve(err));
    }),
    new Promise((resolve) => {
      waitForSelector(INTRO_QRCODE_SELECTOR, {
        timeout: 5000,
      })
        .then(() => resolve(true))
        .catch((err) => resolve(err));
    }),
  ]);

  ipcRenderer.send('WPP_LOG_IN', [false]);
  if (needAuthentication) {
    const QR_CONTAINER = 'div[data-ref]';
    const QR_RETRY_BUTTON = 'div[data-ref] > span > button';

    const qr_container = document.querySelector(QR_CONTAINER) as any;
    const qrChanged = async (qr: string) => {
      ipcRenderer.send('QR_UPDATE', [qr]);
      needAuthentication = await Promise.race([
        new Promise((resolve) => {
          waitForSelector(INTRO_IMG_SELECTOR, { timeout: 5000 })
            .then(() => resolve(false))
            .catch((err) => resolve(err));
        }),
        new Promise((resolve) => {
          waitForSelector(INTRO_QRCODE_SELECTOR, {
            timeout: 5000,
          })
            .then(() => resolve(true))
            .catch((err) => resolve(err));
        }),
      ]);
    };

    qrChanged(qr_container.querySelector('canvas')?.toDataURL());

    const obs = new MutationObserver((muts) => {
      muts.forEach((mut) => {
        // Listens to qr token change
        if (mut.type === 'attributes' && mut.attributeName === 'data-ref') {
          qrChanged((mut.target as any).querySelector('canvas')?.toDataURL());
        }
        // Listens to retry button, when found, click it
        else if (mut.type === 'childList') {
          const retry_button = document.querySelector(QR_RETRY_BUTTON);
          if (retry_button) (retry_button as any).click();
        }
      });
    });
    obs.observe(qr_container.parentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['data-ref'],
    });

    const awaitLogIn = await waitForSelector(INTRO_IMG_SELECTOR, {
      timeout: 100000,
    });
    if (!awaitLogIn) {
      return;
    }
  }
  ipcRenderer.send('WPP_LOG_IN', [true]);

  async function unregisterServiceWorkers() {
    const registrations =
      await window.navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      registration.unregister();
    }
  }

  function isLoadFailed() {
    const titleEl = document.querySelector('.landing-title');
    return titleEl && titleEl.innerHTML.includes('Google Chrome');
  }

  if (isLoadFailed()) {
    await unregisterServiceWorkers();
    window.location.reload();
  }
  Inject();

  header?.insertAdjacentHTML(
    'beforeend',
    `<meta http-equiv="Content-Security-Policy" content="default-src 'unsafe-inline' 'unsafe-eval' 'self' * data: * blob: *;script-src 'unsafe-inline' 'unsafe-eval' 'self' * data: * blob: *;style-src 'unsafe-inline' 'unsafe-eval' 'self' * data: * blob: *;connect-src 'unsafe-inline' 'unsafe-eval' 'self' * data: * blob: *;font-src 'unsafe-inline' 'unsafe-eval' 'self' * data: * blob: *;img-src 'unsafe-inline' 'unsafe-eval' 'self' * data: * blob: *;media-src 'unsafe-inline' 'unsafe-eval' 'self' * data: * blob: *;child-src 'unsafe-inline' 'unsafe-eval' 'self' * data: * blob: *;frame-src 'unsafe-inline' 'unsafe-eval' 'self' * data: * blob: *">
  `
  );
  // clearContacts();
};

export { WhatsappEvents };

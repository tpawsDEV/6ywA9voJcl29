import {
  setCampaignUsage,
  executeCampaignEvent,
  finishExecuteCampaignEvent,
} from '../../functions/marketing';
import { sleep } from '../../functions/util/time';
import { imageToBase64Browser } from './imageToBase64';
import MessageMedia from '../whatsapp/MessageMedia';

const runCampaign = async (campaign: any, setCurrent: Function) => {
  executeCampaignEvent(campaign.store_id, campaign.title);

  let options = {} as any;
  let image = campaign.image;
  if (image) {
    const response = await imageToBase64Browser(image); // Path to the image
    let format = image.split('/');
    format = format[format.length - 1].split('.') as any;
    format = format[format.length - 1] as any;
    options = {
      attachment: new MessageMedia(`image/${format}`, response, 'imagem'),
    };
    await sleep(3000);
  }

  const campaignServer = { ...campaign };
  delete campaignServer.contacts;

  for (let index = 0; index < campaign.contacts.length; index++) {
    setCurrent(index + 1);
    const contact = campaign.contacts[index];

    let phone = contact.tel;

    if (!phone.includes('@')) {
      phone = phone.replace('+', '');
      phone = phone.replace('-', '');
      phone = phone.replace(' ', '');
      phone = phone.replace('(', '');
      phone = phone.replace(')', '');
      phone = phone.replace(' ', '');
      if (phone.substring(0, 2) !== '55') {
        phone = `55${phone}`;
      }
      if (!phone.includes('@')) {
        phone = `${phone}@c.us`;
      }
    }

    let defaultName = '';

    try {
      if (campaign.store_id === 'a8365b40-d1fc-11ec-9b3a-ab3a629e984a') {
        defaultName = 'Tripulante';
      }
    } catch (error) {
      defaultName = '';
    }

    let message = `${campaign.message.text}`
      .split('\\n')
      .join('{nl}')
      .split('\n')
      .join('{nl}')
      .replace(
        '{custom_message}',
        contact.custom_message ? contact.custom_message : ''
      )
      .replace('{nome}', contact.name ? contact.name : defaultName);

    try {
      console.log('Envia Mensagem para o Glutões');
      const campaignUsage = await setCampaignUsage(contact, campaignServer);
      console.log('Aguarda 5 sec');
      await sleep(1500);
      if (campaignUsage.message) {
        message = `${campaignUsage.message}`
          .split('\\n')
          .join('{nl}')
          .split('\n')
          .join('{nl}')
          .replace(
            '{custom_message}',
            contact.custom_message ? contact.custom_message : ''
          )
          .replace('{nome}', contact.name ? contact.name : defaultName);
      }
    } catch (error: any) {
      console.log('Deu erro no envio para o servidor');
      console.log(error.message);
      // const notSents = JSON.parse(localStorage.getItem('notSentsGlutoes'))
      //   ? JSON.parse(localStorage.getItem('notSentsGlutoes'))
      //   : [];
      // notSents.push({
      //   contact: contact,
      //   campaign: campaignServer,
      //   date: new Date().getTime(),
      // });
      // localStorage.setItem('notSentsGlutoes', JSON.stringify(notSents));
      // console.log('ERRO DE INTERNET, ADICIONA AO LOCALSTORAGE');
    }
    if (image) {
      options.caption = message;
      // message = "";
    }
    window.electron.ipcRenderer.sendMessage('SEND_WPP_MESSAGE', [phone, message, options]);
    // await sendMessage(phone, message, campaign.id);
    await sleep(Math.floor(Math.random() * 3900 + 7));
  }

  setCurrent(campaign.contacts.length + 1);
  finishExecuteCampaignEvent(campaign.store_id, campaign.title);
};

const checkNotSent = async () => {
  // const notSents = JSON.parse(localStorage.getItem('notSentsGlutoes'))
  //   ? JSON.parse(localStorage.getItem('notSentsGlutoes'))
  //   : [];

  // const final = [];

  // for (let index = 0; index < notSents.length; index++) {
  //   const notSent = notSents[index];
  //   try {
  //     await setCampaignUsage(notSent.contact, notSent.campaign, notSent.date);
  //   } catch (error) {
  //     final.push(notSent);
  //   }
  // }
  // localStorage.setItem('notSentsGlutoes', JSON.stringify(final));
};

export { runCampaign, checkNotSent };

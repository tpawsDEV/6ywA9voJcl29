import axios from "axios";
import { getMe } from "../whatsapp";

const api = axios.create({
  // baseURL: "http://localhost:3000/",
  baseURL: "https://newmkt.glutoes.com/",
  timeout: 0,
  headers: { "Content-Type": "application/json" },
});

const getMarketingStore = async (id: string) => {
  const result = await api.get(`/prepare-campaigns/${id}`);
  return result.data;
};

const setCampaignUsage = async (
  contact: any,
  campaign: any,
  date?: number
) => {
  const result = await api.post(
    `/campaign-usage`,
    {
      campaign_usage: {
        clicks: 0,
        campaign: campaign,
        contact: contact.id ? contact.id : contact,
        phone: contact.tel ? contact.tel : null,
        date: date ? date : new Date().getTime(),
      },
    },
    { timeout: 2000 }
  );
  return result.data;
};

const getNextCampaign = async (id: string) => {
  // const me = await getMe();
  // ?whatsapp=${me}
  try {
    const result = await api.get(`/prepare-campaigns/${id}`);
    return result;
  } catch (error) {}
  return {data: null}
};

const cancelCampaign = async (id: string) => {
  try {
    const result = await api.get(`/cancel-campaign/${id}`);
    return result;
  } catch (error) {}
};

const getImage = async (id: string) => {
  try {
    const result = await axios.get(
      `https://app.glutoes.com/api/fake-proxy/image/${id}`
    );
    return result;
  } catch (error) {}
};

const executeCampaignEvent = async (store_id: string, campaignTitle: string) => {
  try {
    const result = await axios.post(
      `https://app.glutoes.com/api/fake-proxy/mixpanel_execute_campaign`,
      {
        store_id: store_id,
        campaign_title: campaignTitle,
      }
    );
    return result;
  } catch (e) {
    console.log("Erro ao trackear evento de execução de campanha.");
    console.log(e);
  }
};

const finishExecuteCampaignEvent = async (store_id: string, campaignTitle: string) => {
  try {
    const result = await axios.post(
      `https://app.glutoes.com/api/fake-proxy/mixpanel_finished_execute_campaign`,
      {
        store_id: store_id,
        campaign_title: campaignTitle,
      }
    );
    return result;
  } catch (e) {
    console.log("Erro ao trackear evento de fim de execução de campanha.");
    console.log(e);
  }
};

export {
  getMarketingStore,
  getNextCampaign,
  setCampaignUsage,
  getImage,
  executeCampaignEvent,
  finishExecuteCampaignEvent,
  cancelCampaign,
};

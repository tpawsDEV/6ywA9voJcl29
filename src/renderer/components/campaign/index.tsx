/* eslint-disable jsx-a11y/anchor-has-content */
import React, { useEffect, useRef } from 'react';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';

import './campaign.css';
import Collapsable from '../collapsableCampaign';
import { getNextCampaign } from '../../../functions/marketing';
import { checkNotSent } from '../../../functions/marketing/campaigns';
import { segment, clearContacts } from '../../../functions/whatsapp/index';
import { sleep, compareTime } from '../../../functions/util/time';
interface inputProps {
  idMarketing: string;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  success: string;
  setSuccess: React.Dispatch<React.SetStateAction<string>>;
}

function Campaign({
  idMarketing,
  error,
  setError,
  success,
  setSuccess,
}: inputProps) {
  const lastSearch = useRef(new Date().getTime() as number);
  const campaigns = useRef({} as any);
  const [campaignsState, setCampaignsState] = React.useState(-1 as any);
  const sending = useRef(false as boolean);
  const [searchingNow, setSearchingNow] = React.useState(true);

  const setCampaigns = (campaigns: any) => {
    const finalArray = Object.values(campaigns);

    const sendingNow = finalArray.filter((ca: any) => {
      return ca.sending;
    });

    if (sendingNow.length > 0) {
      sending.current = true;
    } else {
      sending.current = false;
    }

    finalArray.sort(function (a: any, b: any) {
      if (a.lost) {
        if (!b.lost) return -1;
      } else if (b.lost) {
        return 1;
      }

      if (a.sent) {
        if (!b.sent) return -1;
      } else if (b.sent) {
        return 1;
      }

      if (a.sending) {
        if (!b.sending) return -1;
      } else if (b.sending) {
        return 1;
      }

      if (a.timestamp > b.timestamp) {
        return -1;
      } else if (b.timestamp > a.timestamp) {
        return 1;
      }

      if (a.id > b.id) {
        return -1;
      } else {
        return 1;
      }
    });

    const campaignsServer = finalArray.reduce(
      (a: any, v: any) => ({
        ...a,
        [v.id]: v,
      }),
      {}
    );

    setCampaignsState(campaignsServer);
  };

  const campaignJoiner = (serverArray: any) => {
    const final: any = {};

    const localArray = Object.values({ ...campaigns.current });

    for (let index = 0; index < serverArray.length; index++) {
      const serverItem = serverArray[index];

      if (!serverItem.waitTime) {
        serverItem.waitTime = compareTime(
          new Date(serverItem.timestamp * 1000),
          new Date()
        );
      }

      if (!serverItem.current) {
        serverItem.current = 0;
      }

      final[serverItem.id] = serverItem;
    }

    for (let i2 = 0; i2 < localArray.length; i2++) {
      const localItem: any = localArray[i2];

      if (!localItem.waitTime) {
        localItem.waitTime = compareTime(
          new Date(localItem.timestamp * 1000),
          new Date()
        );
      }

      if (
        localItem.hide ||
        localItem.sending ||
        localItem.sent ||
        localItem.current
      ) {
        final[localItem.id] = localItem;
      }
    }

    return final;
  };

  const getNxtCampaigns = async (idMarketing: string, auto = false) => {
    try {
      checkNotSent();
    } catch (error) {}

    const TIME_BETWEEN_SEARCHS = 15 * 60 * 1000;
    if (
      auto &&
      new Date().getTime() - lastSearch.current < TIME_BETWEEN_SEARCHS
    ) {
      return true;
    }

    setSearchingNow(true);

    const ct = (await getNextCampaign(idMarketing)).data;
    lastSearch.current = new Date().getTime();

    const campaignsServer = ct.campaigns ? ct.campaigns : [];

    const finalCampaigns = campaignJoiner(campaignsServer);
    setSearchingNow(false);
    setCampaigns(finalCampaigns);

    if (ct.error && !sending.current) setError(ct.error);
    else if (ct.success) setSuccess(ct.success);

    await sleep(TIME_BETWEEN_SEARCHS);
    getNxtCampaigns(idMarketing, true);
  };

  async function reactClearContacts() {
    let c = await clearContacts();
    while (c) {
      c = await clearContacts();
    }
  }

  useEffect(() => {
    if (sending.current) {
      window.onbeforeunload = () => {
        return 'Campanha sendo enviada, deseja cancelar?';
      };
    } else {
      window.onbeforeunload = () => {};
    }
  }, [sending.current]);

  useEffect(() => {
    campaigns.current = campaignsState;
  }, [campaignsState]);

  useEffect(() => {
    let ignore = false;

    async function executeHook() {
      try {
        try {
          console.log('Procura Campanha');
          await getNxtCampaigns(idMarketing);
        } catch (error) {
          console.log('Erro na campanha: ');
          console.log(error);
        }
      } catch (error) {
        console.log(error);
        // console.log("Ja injetado");
      }
    }

    if (!ignore) {
      executeHook();
    }

    return () => {
      ignore = true;
    };
  }, [idMarketing]);

  const setCampaign = (campaign: any) => {
    if (campaigns.current != -1) {
      campaigns.current[campaign.id] = campaign;
    }
  };

  const renderCampaignDetails = () => {
    if ((error || success) && !sending.current) return null;
    if (campaignsState === -1)
      return (
        <>
          <Typography variant="h6" gutterBottom>
            Buscando suas Campanhas
          </Typography>
        </>
      );

    if (campaignsState.length === 0) {
      return (
        <Typography variant="h6" gutterBottom>
          Nenhuma Campanha Preparada para hoje
        </Typography>
      );
    }
  };

  const renderCampaigns = () => {
    try {
      return Object.values(campaignsState).length
        ? Object.values(campaignsState).map((campaign: any) => {
            return (
              <Collapsable
                key={'campanha' + campaign.id}
                campaign={campaign}
                setCampaign={setCampaign}
              />
            );
          })
        : '';
    } catch (error) {
      return null;
    }
  };

  return (
    <div
      style={{
        maxHeight: 'calc(100vh - 50px)',
        overflowY: 'auto',
        paddingTop: '20px',
      }}
    >
      {!error && !success}
      {searchingNow ? (
        <LinearProgress
          style={{ position: 'relative', top: '-20px' }}
        ></LinearProgress>
      ) : null}
      {renderCampaignDetails()}
      {renderCampaigns()}
      {
        <Button
          sx={{
            margin: '25px 0',
            color: '#fff',
            backgroundColor: '#2d2d2d',
            '&:hover': {
              backgroundColor: '#7a7a7a',
            },
          }}
          onClick={() => {
            setError('');
            setSuccess('');
            getNxtCampaigns(idMarketing);
          }}
        >
          Atualizar Campanhas
        </Button>
      }
    </div>
  );
}

export default Campaign;

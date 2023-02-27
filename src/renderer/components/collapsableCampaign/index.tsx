/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';

import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { cancelCampaign } from '../../../functions/marketing';
import { compareTime, sleep } from '../../../functions/util/time';
import { runCampaign } from '../../../functions/marketing/campaigns';

interface Props {
  campaign: any;
  setCampaign: (c: any) => void;
  sendCampaign?: boolean;
}

function Collapsable({ campaign, setCampaign, sendCampaign = true }: Props) {
  const timeuntill = useRef(0 as any);
  const sendingRef = useRef(false as any);
  const [current, setCurrentState] = useState(campaign.current);
  const [waitTime, setWaitTime] = useState(campaign.waitTime as any);
  const [sending, setSending] = useState(false as any);

  const setCurrent = (localCurrent: any) => {
    const c = { ...campaign };
    setCurrentState(localCurrent);
    if (current > c.contacts.length) {
      c.sent = true;
      c.sending = false;
    } else {
      c.sent = false;
      c.sending = true;
    }
    c.current = current;
    if (!c.sent) {
      setCampaign(c);
    }
  };

  const setHide = () => {
    const c = { ...campaign };
    c.hide = true;
    setCampaign(c);
  };

  useEffect(() => {
    const c = { ...campaign };
    c.sending = sending;
    setCampaign(c);
  }, [sending]);

  const executeCampaign = async () => {
    if (sendCampaign) {
      setSending(true);
      if (!sendingRef.current && !sending) {
        sendingRef.current = true;
        await runCampaign(campaign, setCurrent);
      }
    }
  };

  useEffect(() => {
    async function executeHook() {
      timeuntill.current = campaign.timestamp;
      if (!campaign.lost && !sending && !campaign.sent) {
        const campaignTime = new Date(campaign.timestamp * 1000);
        await sleep(1000);
        if (timeuntill.current !== campaign.timestamp) {
          return null;
        }
        const ct = compareTime(campaignTime, new Date());
        if (ct === 0) {
          await executeCampaign();
        } else if ((ct as any).days >= 0) {
          setWaitTime(ct);
        }
      }
      return null;
    }
    executeHook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign, waitTime]);

  if (campaign.hide) {
    return null;
  }
  if (campaign.lost && !sending) {
    return (
      <div
        style={{
          flex: '1',
          alignItems: 'center',
          display: 'flex',
        }}
      >
        <div className="glutoes-extension-lost-campaign">
          <Typography
            variant="h6"
            gutterBottom
            style={{ color: 'black', fontWeight: 'bold' }}
          >
            Você perdeu o envio da campanha: <br />
            {campaign.title}
          </Typography>
          <br />
          <Typography variant="subtitle1" gutterBottom>
            Você pode escolher enviar agora ou cancelar o envio.
          </Typography>
          <button
            type="button"
            onClick={async () => {
              await cancelCampaign(campaign._id);
              await executeCampaign();
            }}
            className="glutoes-button-send-cancel-campaign"
            style={{
              background: '#785dd1',
              fontWeight: 'bold',
            }}
          >
            <CheckCircleIcon style={{ flex: 1 }} />
            <span style={{ flex: 3 }}>Enviar Agora</span>
          </button>
          <button
            type="button"
            className="glutoes-button-send-cancel-campaign"
            style={{
              color: 'black',
              textDecoration: 'underline',
            }}
            onClick={async () => {
              await cancelCampaign(campaign._id);
              setHide();
            }}
          >
            <span style={{ flex: 1 }}>Cancelar Campanha</span>
          </button>
        </div>
      </div>
    );
  }
  return (
    <div
      style={{
        padding: '5px',
        display: 'flex',
        textAlign: 'center',
        marginBottom: '15px',
      }}
    >
      {!sending ? (
        <>
          <div
            style={{
              flex: '1',
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant="subtitle1">{campaign.title}</Typography>
            {/* <Typography variant="caption">
              {campaign.campaign_types[0].title}
            </Typography> */}
            <Typography variant="caption">
              {campaign.contacts.length} envios possíveis
            </Typography>
          </div>
          <div
            style={{
              flex: '1',
              alignItems: 'center',
              display: 'flex',
            }}
          >
            <div className="counterGlutoes">
              <div className="Glutoescounter-item">
                <span className="valueTimerGlutoes">
                  {String(waitTime?.hours).padStart(2, '0')}
                </span>
                <span className="labelTimerGlutoes">Horas</span>
              </div>
              :
              <div className="Glutoescounter-item">
                <span className="valueTimerGlutoes">
                  {String(waitTime?.minutes).padStart(2, '0')}
                </span>
                <span className="labelTimerGlutoes">Minutos</span>
              </div>
              :
              <div className="Glutoescounter-item">
                <span className="valueTimerGlutoes">
                  {String(waitTime?.seconds).padStart(2, '0')}
                </span>
                <span className="labelTimerGlutoes">Segundos</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              flex: '1',
              alignItems: 'center',
              flexDirection: 'column',
              opacity: current > campaign.contacts.length ? '0.5' : '1',
            }}
          >
            <Typography variant="h6">{campaign.title}</Typography>
            {current > campaign.contacts.length ? (
              <Typography variant="subtitle1">
                Todos envios realizados
              </Typography>
            ) : (
              <>
                <Typography variant="subtitle1">Envios:</Typography>
                <Typography variant="subtitle1">
                  {current} / {campaign.contacts.length}
                </Typography>
              </>
            )}
            <LinearProgress
              variant="determinate"
              value={Math.min((current * 100) / campaign.contacts.length, 100)}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Collapsable;

import React, { useEffect } from 'react';
import './form.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Campaign from '../campaign';
import ErrorBlock from '../errorBlock';
import SuccessBlock from '../successBlock';
import logo from './logo.png';
import CircularProgress from '@mui/material/CircularProgress';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PortableWifiOffIcon from '@mui/icons-material/PortableWifiOff';
function IdForm() {
  const [idGlutoes, setIdGlutoes] = React.useState('');
  const [idGlutoesKey, setIdGlutoesKey] = React.useState('');
  const [qrCode, setQrCode] = React.useState('');
  const [whatsappConnectionMessage, setWhatsappConnectionMessage] =
    React.useState<any>({});
  const [loggedIn, setLoggedIn] = React.useState<number>(2);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const [whatsappPhone, setWhatsappPhone] = React.useState('');

  useEffect(() => {
    if (error && !error.includes('Nenhuma')) {
      window.electron.ipcRenderer.sendMessage('TOGGLE_WINDOW', [true]);
    }
  }, [error]);

  window.electron.ipcRenderer.on('WPP_LOG_IN', async (event: any) => {
    setLoggedIn((event as boolean) ? 1 : 0);
  });

  window.electron.ipcRenderer.once('SAVE_GLUTOES_KEY', async (event: any) => {
    setIdGlutoesKey(event as string);
  });

  window.electron.ipcRenderer.on('WHATSAPP_PHONE', async (event: any) => {
    setWhatsappPhone(event as string);
  });

  window.electron.ipcRenderer.on('QR_UPDATE', async (event: any) => {
    setQrCode(event as string);
  });

  const saveId = (e: React.FormEvent) => {
    e.preventDefault();
    setIdGlutoesKey(idGlutoes);
    window.electron.ipcRenderer.sendMessage('SAVE_GLUTOES_KEY', [idGlutoes]);
  };
  const myChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdGlutoes(e.target.value);
  };

  useEffect(() => {
    if (loggedIn == 2) {
      setWhatsappConnectionMessage({
        title: 'Aguardando Conexão com o whatsapp',
        message: 'O whatsapp está abrindo',
      });
    } else if (loggedIn == 1 && whatsappPhone == '') {
      setWhatsappConnectionMessage({
        title: 'Aguardando Conexão com o whatsapp',
        message: 'O whatsapp está conectando',
      });
    } else if (loggedIn == 1 && whatsappPhone != '') {
      setWhatsappConnectionMessage({
        title: 'Whatsapp Conectado',
        message: '',
      });
    } else if (loggedIn == 0) {
      setWhatsappConnectionMessage({
        title: 'Whatsapp Desconectado',
        message: '',
      });
    }
  }, [loggedIn, whatsappPhone]);

  const getConnectionIcon = () => {
    if (loggedIn == 2) {
      // loading
      return <CircularProgress color="inherit" />;
    } else if (loggedIn == 1 && whatsappPhone == '') {
      return <CircularProgress color="inherit" />;
      // connected
    } else if (loggedIn == 1 && whatsappPhone != '') {
      return <WhatsAppIcon />;
      // connected
    } else if (loggedIn == 0) {
      return <PortableWifiOffIcon />;
      // disconnected
    }
  };
  return (
    <>
      <div className="statusConnection">
        <div className="statusChild" style={{ maxWidth: '40px' }}>
          {getConnectionIcon()}
        </div>
        <div className="statusChild">
          <span className="statusConnectionTitle">
            {whatsappConnectionMessage.title}
          </span>
          {/* <br />
          <span className="statusConnectionText">
            {whatsappConnectionMessage.message}
          </span> */}
        </div>
      </div>
      {error && <ErrorBlock error={error} />}
      {success && <SuccessBlock success={success} />}
      <div className="idForm">
        {qrCode && !loggedIn ? (
          <div className="qrCodeDiv">
            <span className="qrCodeTitle">
              Por favor, conect o Whatsapp com o QR Code abaixo
            </span>
            <div className="qrContainer">
              <img src={`${qrCode}`} alt="QRCODE" className="qrCode" />
              <img src={logo} alt="LOGO" className="logo" />
            </div>
          </div>
        ) : (
          ''
        )}

        {!idGlutoesKey || idGlutoesKey === '' ? (
          <form onSubmit={saveId}>
            <TextField
              type="text"
              id="idGlutoes"
              name="idGlutoes"
              variant="standard"
              placeholder="Seu código Glutões"
              value={idGlutoes}
              onChange={myChangeHandler}
              sx={{
                marginTop: '15px',
                textAlign: 'center',
              }}
            />
            <br />
            <Button
              variant="outlined"
              type="submit"
              name="Enviar"
              id="enviar"
              color="primary"
              onClick={saveId}
              sx={{
                marginTop: '10px',
                marginLeft: '10px',
                color: '#fff',
                backgroundColor: '#2d2d2d',
                '&:hover': {
                  backgroundColor: '#7a7a7a',
                },
              }}
            >
              Salvar
            </Button>
          </form>
        ) : (
          <>
            <Campaign
              idMarketing={idGlutoesKey}
              error={error}
              setError={setError}
              success={success}
              setSuccess={setSuccess}
              whatsappLoaded={loggedIn == 1}
              whatsappPhone={whatsappPhone}
            />
          </>
        )}
      </div>
    </>
  );
}

export default IdForm;

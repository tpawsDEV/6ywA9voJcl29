import React, { useEffect } from 'react';
import './form.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Campaign from '../campaign';
import ErrorBlock from '../errorBlock';
import SuccessBlock from '../successBlock';
import logo from './logo.png';

function IdForm() {
  const [idGlutoes, setIdGlutoes] = React.useState('');
  const [idGlutoesKey, setIdGlutoesKey] = React.useState('');
  const [qrCode, setQrCode] = React.useState('');
  const [loggedIn, setLoggedIn] = React.useState(true);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  useEffect(() => {
    if (error && !error.includes('Nenhuma')) {
      window.electron.ipcRenderer.sendMessage('TOGGLE_WINDOW', [true]);
    }
  }, [error]);

  window.electron.ipcRenderer.once('WPP_LOG_IN', async (event: any) => {
    setLoggedIn(event as boolean);
  });

  window.electron.ipcRenderer.once('SAVE_GLUTOES_KEY', async (event: any) => {
    setIdGlutoesKey(event as string);
  });

  window.electron.ipcRenderer.once('QR_UPDATE', async (event: any) => {
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

  return (
    <>
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
            />
          </>
        )}
      </div>
    </>
  );
}

export default IdForm;

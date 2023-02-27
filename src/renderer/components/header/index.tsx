/* eslint-disable jsx-a11y/anchor-has-content */
import './header.css';

import Button from '@mui/material/Button';

function Header() {
  return (
    <header className="Glutoes-extension-header">
      <a
        href="https://app.glutoes.com/login"
        target="_blank"
        className="Glutoes-extension-link"
        rel="noreferrer"
      >
        <img
          src="https://s3.sa-east-1.amazonaws.com/app.glutoes.com/logo.png"
          className="Glutoes-extension-link-image"
          alt="Logo"
        />
      </a>
      <Button
        sx={{
          position: 'relative',
          // right: "10px",
          top: '5px',
          color: '#fff',
          backgroundColor: '#2d2d2d',
          '&:hover': {
            backgroundColor: '#7a7a7a',
          },
        }}
        variant="outlined"
        type="submit"
        name="Enviar"
        id="enviar"
        color="primary"
        onClick={() => {
          window.electron.ipcRenderer.sendMessage('SAVE_GLUTOES_KEY', [null]);
        }}
      >
        Trocar Loja
      </Button>
      <Button
        sx={{
          position: 'absolute',
          right: '5px',
          top: '5px',
          color: '#fff',
          backgroundColor: '#2d2d2d',
          '&:hover': {
            backgroundColor: '#7a7a7a',
          },
        }}
        variant="text"
        type="submit"
        name="hide"
        id="hide"
        color="primary"
        onClick={() => {
          window.electron.ipcRenderer.sendMessage('TOGGLE_WINDOW', []);
        }}
      >
        X
      </Button>
    </header>
  );
}

export default Header;

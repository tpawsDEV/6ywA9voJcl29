import ErrorIcon from '@mui/icons-material/Error';

import './errorBlock.css';

interface Props {
  error: string;
}

function ErrorBlock({ error }: Props) {
  return (
    <>
      <div className="errorBlockGlutoes">
        <ErrorIcon
          style={{
            color: 'var(--errorColor)',
            marginRight: '10px',
            transform: 'scale(1.2)',
          }}
        />
        {error}
      </div>

      <a
        className="whatsPopup"
        rel="nofollow noreferrer"
        onClick={() => {
          window.electron.ipcRenderer.sendMessage('OPEN_EXTERNAL', ["https://api.whatsapp.com/send?phone=+553141017344&text=Olá! Estou precisando de uma ajudinha."]);
        }}
        target="_blank"
      >
        <span style={{ marginRight: '10px' }}>Precisa de ajuda? </span>
        <img
          src="https://s3.sa-east-1.amazonaws.com/app.glutoes.com/whatsapp.png"
          className="whatsImg"
          alt="whatsApp Suport"
        />
      </a>
    </>
  );
}

export default ErrorBlock;

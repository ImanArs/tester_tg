import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import WebApp from '@twa-dev/sdk';

WebApp.ready();
WebApp.setHeaderColor('bg_color');
WebApp.setBackgroundColor('#000');
const theme = WebApp.themeParams;
console.log('Текущая тема:', theme);

// 8142280919:AAH21nUNSSdMTISMMI97yjOM48nfrc1Rc8w

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

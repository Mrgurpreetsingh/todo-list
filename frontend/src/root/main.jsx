import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css'; // Changé de ./src/index.css à ../index.css
import App from './App.jsx'; // Corrigé : App.jsx est dans le même dossier (src/root/)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
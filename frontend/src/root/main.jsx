import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@context/AuthProvider';  // Utilisation de @context ici aussi
import App from './App.jsx';  

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>  {/* Le Router enveloppe l'application entière */}
      <AuthProvider>  {/* AuthProvider à l'intérieur du Router */}
        <App />
      </AuthProvider>
    </Router>
  </StrictMode>
);

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/fredoka';
import App from './App.jsx';
import { AppProvider } from './hooks/AppContext.jsx';
import './styles/global.css';
import './styles/pages.css';
import './styles/stage.css';
import './animations/characters.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>,
);

import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register PWA service worker in production
if (import.meta.env.PROD && typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Ignored
    });
  });
}

createRoot(document.getElementById('root')!).render(<App />);

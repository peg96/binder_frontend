import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registrato con successo:', registration.scope);
      })
      .catch(error => {
        console.log('Registrazione Service Worker fallita:', error);
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);

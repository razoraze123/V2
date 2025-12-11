import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ToastProvider } from './components/ToastContext';
import { ActionProvider } from './components/ActionContext';
import './styles/glass-theme.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ToastProvider>
      <ActionProvider>
        <App />
      </ActionProvider>
    </ToastProvider>
  </React.StrictMode>
);
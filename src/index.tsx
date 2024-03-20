import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import RootStore from './shared/stores/root.store';
import { BrowserRouter } from 'react-router-dom';
import './services/i18n';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './services/keycloak-config';
import CenterLoader from './shared/components/loaders/CenterLoader';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

export const hostURL = new URL(window.location.href)


const rootStore = new RootStore()
export const Context = createContext<RootStore>(rootStore)

const eventLogger = (event: string, error?: any) => {
  console.log('onKeycloakEvent', event, error);
};

const tokenLogger = (tokens: any) => {
  console.log('onKeycloakTokens', tokens);
};

root.render(
  <ReactKeycloakProvider
    authClient={keycloak}
    LoadingComponent={<CenterLoader />}
    onEvent={eventLogger}
    onTokens={tokenLogger}
    initOptions={{
      onLoad: 'login-required',
      checkLoginIframe: false
    }}
  >
    <Context.Provider value={rootStore}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Context.Provider>
  </ReactKeycloakProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './services/i18n';
import keycloakInstance from './services/keycloak-config';
import OverlayCogwheelLoader from './shared/components/loaders/OverlayCogwheelLoader';
import RootStore from './shared/stores/root.store';
import { isProduction } from './shared/env.const';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './shared/components/error.boundaries/ErrorFallback';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

export const hostURL = new URL(window.location.href)

const rootStore = new RootStore()
export const Context = createContext<RootStore>(rootStore)

const eventLogger = (event: string, error?: any) => {
  if (!isProduction) console.log('onKeycloakEvent', event, error);
};

const tokenLogger = (tokens: any) => {
  if (!isProduction) console.log('onKeycloakTokens', tokens);
}

root.render(
  <ReactKeycloakProvider
    authClient={keycloakInstance}
    LoadingComponent={<OverlayCogwheelLoader />}
    onEvent={eventLogger}
    onTokens={tokenLogger}
    initOptions={{
      onLoad: 'login-required',
      checkLoginIframe: false
    }}
  >
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Context.Provider value={rootStore}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Context.Provider>
    </ErrorBoundary>
  </ReactKeycloakProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
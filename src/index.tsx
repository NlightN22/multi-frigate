import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import RootStore from './shared/stores/root.store';
import { AuthProvider, AuthProviderProps } from 'react-oidc-context';
import { isProduction, oidpSettings } from './shared/env.const';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

export const hostURL = new URL(window.location.href)

export const keycloakConfig: AuthProviderProps = {
  authority: oidpSettings.server,
  client_id: oidpSettings.clientId,
  redirect_uri: hostURL.toString(),
  onSigninCallback: () => {
    const currentUrl = new URL(window.location.href);
    const params = currentUrl.searchParams;
    params.delete('state');
    params.delete('session_state');
    params.delete('code');
    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`
    window.history.replaceState({}, document.title, newUrl)
  }
}

const rootStore = new RootStore()
export const Context = createContext<RootStore>(rootStore)

if (!isProduction) {
  console.log('keycloakConfig.authority', keycloakConfig.authority)
  console.log('keycloakConfig.client_id', keycloakConfig.client_id)
  console.log('keycloakConfig.redirect_uri', keycloakConfig.redirect_uri)
}

root.render(
  <Context.Provider value={rootStore}>
    <AuthProvider {...keycloakConfig}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </Context.Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
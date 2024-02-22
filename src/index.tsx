import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import RootStore from './shared/stores/root.store';
import { AuthProvider, AuthProviderProps } from 'react-oidc-context';
import { oidpSettings } from './shared/env.const';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

export const hostURL = new URL(window.location.href)

export const keycloakConfig: AuthProviderProps = {
  authority: oidpSettings.server,
  client_id: oidpSettings.clientId,
  redirect_uri: hostURL.toString(),
  onSigninCallback: () => {
       window.history.replaceState(
           {},
           document.title,
           window.location.pathname
       )
   }
}

const rootStore = new RootStore()
export const Context = createContext<RootStore>(rootStore)

root.render(
    <Context.Provider value={rootStore}>
      <AuthProvider {...keycloakConfig}>
        {/* <React.StrictMode> */}
          <App />
        {/* </React.StrictMode> */}
      </AuthProvider>
    </Context.Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();



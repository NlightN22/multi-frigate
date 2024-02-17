import { AuthProviderProps } from "react-oidc-context";
import { openIdServer, clientId, redirectURL } from "../env.const";

export const keycloakConfig: AuthProviderProps = {
    authority: openIdServer,
    client_id: clientId,
    redirect_uri: redirectURL,
    onSigninCallback: () => {
         window.history.replaceState(
             {},
             document.title,
             window.location.pathname
         )
     }
}
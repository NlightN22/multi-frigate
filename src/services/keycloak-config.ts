import Keycloak from "keycloak-js";
import { oidpSettings } from "../shared/env.const";

const keycloakConfig = {
    url: oidpSettings.server,
    realm: oidpSettings.realm,
    clientId: oidpSettings.clientId,
  };
  
  const keycloak = new Keycloak(keycloakConfig);
  
  export default keycloak;
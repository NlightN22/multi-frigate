import Keycloak from "keycloak-js";
import { oidpSettings } from "../shared/env.const";

const keycloakConfig = {
  url: oidpSettings.server,
  realm: oidpSettings.realm,
  clientId: oidpSettings.clientId,
};

const keycloakInstance = new Keycloak(keycloakConfig)

export default keycloakInstance;
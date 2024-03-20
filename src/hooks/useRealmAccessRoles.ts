import { useState, useEffect } from "react";
import { isProduction } from "../shared/env.const";
import { useKeycloak } from "@react-keycloak/web";

export const useRealmAccessRoles = () => {
    const [roles, setRoles] = useState<string[]>([]);
    const { keycloak } = useKeycloak()

    useEffect(() => {
        const updateRoles = () => {
            const tokenRoles = keycloak.tokenParsed?.realm_access?.roles;
            if (!isProduction) console.log(`tokenRoles:`, tokenRoles);
            if (tokenRoles) {
                setRoles(tokenRoles);
            } else {
                setRoles([])
            }
        }
        
        updateRoles()

        keycloak.onAuthSuccess = () => {
            updateRoles()
        }
        keycloak.onAuthRefreshSuccess = () => {
            updateRoles()
        }

        return () => {
            keycloak.onAuthSuccess = undefined
            keycloak.onAuthRefreshSuccess = undefined
        }
    }, [keycloak, keycloak.onAuthSuccess, keycloak.onAuthRefreshSuccess ])

    return roles
}
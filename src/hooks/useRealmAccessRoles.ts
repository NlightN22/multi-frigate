import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";

interface CustomJwtPayload {
    realm_access?: {
        roles: string[];
    };
}

export const useRealmAccessRoles = () => {
    const { user } = useAuth();
    const [roles, setRoles] = useState<string[]>([]);

    useEffect(() => {
        if (user) {
            try {
                const decoded = jwtDecode<CustomJwtPayload>(user.access_token);
                const realmAccess = decoded.realm_access;
                if (realmAccess && realmAccess.roles) {
                    setRoles(realmAccess.roles);
                }
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, [user]);

    return roles;
};
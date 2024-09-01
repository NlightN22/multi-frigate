import { useKeycloak } from "@react-keycloak/web"
import { z } from "zod"
import { isProduction } from "../shared/env.const"

const keycloakUser = z.object({
    sub: z.string(),
    name: z.string(),
    preferred_username: z.string(),
    given_name: z.string(),
    family_name: z.string()
})

interface RealmUser {
    id: string // sub
    username: string // preferred_username
    givenName?: string // given_name
    familyName?: string // family_name
}

export const useRealmUser = () => {
    const { keycloak } = useKeycloak()
    if (!isProduction) console.log('Authenticated:', keycloak.authenticated)
    if (!isProduction) console.log('userInfo:', keycloak.userInfo)
    if (keycloak.authenticated && keycloak.tokenParsed) {
        const parsedUser = keycloakUser.safeParse(keycloak.tokenParsed)
        if (parsedUser.success) {
            const realmUser: RealmUser = {
                id: parsedUser.data.sub,
                username: parsedUser.data.preferred_username,
                givenName: parsedUser.data.given_name,
                familyName: parsedUser.data.family_name
            }
            return realmUser
        }
    }
    return null
}
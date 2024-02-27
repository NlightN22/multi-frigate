import { useQuery } from "@tanstack/react-query";
import { frigateQueryKeys, frigateApi } from "../services/frigate.proxy/frigate.api";
import { useRealmAccessRoles } from "./useRealmAccessRoles";


export const useAdminRole = () => {
    const { data: adminConfig, isError, isPending } = useQuery({
        queryKey: [frigateQueryKeys.getAdminRole],
        queryFn: frigateApi.getAdminRole
    })

    const roles = useRealmAccessRoles()

    if (isPending) return { isAdmin: undefined, isLoading: true }
    if (isError) return { isAdmin: false, isError: true }
    if (!adminConfig) return { isAdmin: true }
    if (adminConfig && !adminConfig.value) return { isAdmin: true }
    const isAdmin = roles.some(role => role === adminConfig.value)
    return { isAdmin }
}
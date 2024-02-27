import { useQuery } from "@tanstack/react-query";
import { frigateQueryKeys, frigateApi } from "../services/frigate.proxy/frigate.api";
import { useRealmAccessRoles } from "./useRealmAccessRoles";
import { useEffect, useState } from "react";


export const useAdminRole = () => {
    const { data: adminConfig, isError, isFetching } = useQuery({
        queryKey: [frigateQueryKeys.getAdminRole],
        queryFn: frigateApi.getAdminRole,
        staleTime: 1000 * 60 * 60, 
        gcTime: 1000 * 60 * 60 * 24, 
    })

    const roles = useRealmAccessRoles()
    const [initialized, setInitialized] = useState(false)
    const isLoading = isFetching || roles === undefined

    useEffect(() => {
        if (!isLoading) {
            setInitialized(true);
        }
    }, [isLoading]);

    if (!initialized || isLoading) return { isAdmin: undefined, isLoading: true }
    if (isError) return { isAdmin: false, isError: true, isLoading: false }
    if (!adminConfig) return { isAdmin: true, isLoading: false }
    if (adminConfig && !adminConfig.value) return { isAdmin: true, isLoading: false }
    const isAdmin = roles.some(role => role === adminConfig.value)
    return { isAdmin, isLoading: false }
}
import { useQuery } from "@tanstack/react-query";
import { frigateQueryKeys, frigateApi } from "../services/frigate.proxy/frigate.api";
import { useRealmAccessRoles } from "./useRealmAccessRoles";
import { useEffect, useState } from "react";

export interface AdminRole {
    isLoading: boolean
    isAdmin: boolean
}

export const useAdminRole = (): AdminRole => {
    const { data: adminConfig, isError, isLoading } = useQuery({
        queryKey: [frigateQueryKeys.getAdminRole],
        queryFn: frigateApi.getAdminRole,
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60 * 24,
    })

    const roles = useRealmAccessRoles()
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        if (adminConfig) {
            const checkAdmin = roles.some(role => role === adminConfig.value)
            setIsAdmin(checkAdmin)
        } else {
            setIsAdmin(false)
        }
    }, [roles, adminConfig, isLoading])

    return { isLoading, isAdmin }
}
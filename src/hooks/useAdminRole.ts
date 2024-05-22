import { useQuery } from "@tanstack/react-query";
import { frigateQueryKeys, frigateApi } from "../services/frigate.proxy/frigate.api";
import { useRealmAccessRoles } from "./useRealmAccessRoles";
import { useEffect, useState } from "react";
import { isProduction } from "../shared/env.const";
import { getConfigSchema } from "../services/frigate.proxy/frigate.schema";

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

    if (isError) setIsAdmin(false)

    useEffect(() => {
        const parsedConfig = getConfigSchema.safeParse(adminConfig)
        if (!isProduction) console.log('useAdminRole parsedConfig success:', parsedConfig.success)
        if (!parsedConfig.success) {
            setIsAdmin(true)
            return
        }
        if (parsedConfig.success) {
            const checkAdmin = roles.some(role => role === parsedConfig.data.value)
            setIsAdmin(checkAdmin)
        } else {
            setIsAdmin(false)
        }
    }, [roles, adminConfig, isLoading])

    return { isLoading, isAdmin }
}
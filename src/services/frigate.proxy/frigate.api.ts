import axios from "axios"
import { proxyURL } from "../../shared/env.const"

export interface Config {
    key: string,
    value: string,
    description: string,
    encrypted: boolean,
}
export interface PutConfig {
    key: string,
    value: string,
}

export interface FrigateHost {
    id: string
    createAt: string
    updateAt: string
    name: string
    host: string
    enabled: boolean
}

const instance = axios.create({
    baseURL: proxyURL.toString(),
    timeout: 30000,
});

export const frigateApi = {
    getConfig: () => instance.get<Config[]>('apiv1/config').then(res => res.data),
    putConfig: (config: PutConfig[]) => instance.put('apiv1/config', config).then(res => res.data),
    getHosts: () => instance.get<FrigateHost[]>('apiv1/frigate-hosts').then(res => {
        // return new Map(res.data.map(item => [item.id, item]))
        return res.data
    }),
}
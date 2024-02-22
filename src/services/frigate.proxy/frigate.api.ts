import axios from "axios"
import { proxyURL } from "../../shared/env.const"
import { z } from "zod"
import { GetConfig, DeleteFrigateHost, GetFrigateHost, PutConfig, PutFrigateHost, GetFrigateHostWithCameras, GetCameraWHost, GetCameraWHostWConfig } from "./frigate.schema";
import { FrigateConfig } from "../../types/frigateConfig";
import { url } from "inspector";


const instanceApi = axios.create({
    baseURL: proxyURL.toString(),
    timeout: 30000,
});

export const frigateApi = {
    getConfig: () => instanceApi.get<GetConfig[]>('apiv1/config').then(res => res.data),
    putConfig: (config: PutConfig[]) => instanceApi.put('apiv1/config', config).then(res => res.data),
    getHosts: () => instanceApi.get<GetFrigateHost[]>('apiv1/frigate-hosts').then(res => {
        return res.data
    }),
    getHostWithCameras: () => instanceApi.get<GetFrigateHostWithCameras[]>('apiv1/frigate-hosts', { params: { include: 'cameras' } }).then(res => {
        return res.data
    }),
    getHost: (id: string) => instanceApi.get<GetFrigateHostWithCameras>(`apiv1/frigate-hosts/${id}`).then(res => {
        return res.data
    }),
    getCamerasWHost: () => instanceApi.get<GetCameraWHostWConfig[]>(`apiv1/cameras`).then(res => { return res.data }),
    getCameraWHost: (id: string) => instanceApi.get<GetCameraWHostWConfig>(`apiv1/cameras/${id}`).then(res => { return res.data }),
    putHosts: (hosts: PutFrigateHost[]) => instanceApi.put<GetFrigateHost[]>('apiv1/frigate-hosts', hosts).then(res => {
        return res.data
    }),
    deleteHosts: (hosts: DeleteFrigateHost[]) => instanceApi.delete<GetFrigateHost[]>('apiv1/frigate-hosts', { data: hosts }).then(res => {
        return res.data
    }),
}

export const proxyApi = {
    getHostConfigRaw: (hostName: string) => instanceApi.get('proxy/api/config/raw', { params: { hostName: hostName } }).then(res => res.data),
    getHostConfig: (hostName: string) => instanceApi.get('proxy/api/config', { params: { hostName: hostName } }).then(res => res.data),
    getImageFrigate: async (imageUrl: string) => {
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.blob();
    },
    cameraWsURL: (hostName: string, cameraName: string) => {
        return `ws://${proxyURL.host}/proxy-ws/live/jsmpeg/${cameraName}?hostName=${hostName}`
    },
    cameraImageURL: (hostName: string, cameraName: string) => {
        return `http://${proxyURL.host}/proxy/api/${cameraName}/latest.jpg?hostName=${hostName}`
    },
}

export const mapCamerasFromConfig = (config: FrigateConfig): string[] => {
    return Object.keys(config.cameras)
}

export const mapHostToHostname = (host: GetFrigateHost): string => {
    const url = new URL(host.host)
    const hostName = url.host
    return hostName
}

export const frigateQueryKeys = {
    getConfig: 'config',
    getFrigateHosts: 'frigate-hosts',
    getFrigateHostsConfigs: 'frigate-hosts-configs',
    getFrigateHost: 'frigate-host',
    getCamerasWHost: 'cameras-frigate-host',
    getCameraWHost: 'camera-frigate-host',
    getHostConfig: 'host-config',
}

import axios from "axios"
import { proxyURL } from "../../shared/env.const"
import {
    GetConfig, DeleteFrigateHost, GetFrigateHost, PutConfig, PutFrigateHost,
    GetCameraWHostWConfig, GetRole,
    GetRoleWCameras, GetExportedFile
} from "./frigate.schema";
import { FrigateConfig } from "../../types/frigateConfig";
import { RecordSummary } from "../../types/record";
import { EventFrigate } from "../../types/event";
import { keycloakConfig } from "../..";


export const getToken = (): string | undefined => {
    const key = `oidc.user:${keycloakConfig.authority}:${keycloakConfig.client_id}`;
    const stored = sessionStorage.getItem(key);
    const storedObject = stored ? JSON.parse(stored) : null;
    return storedObject?.access_token;
}

const instanceApi = axios.create({
    baseURL: proxyURL.toString(),
    timeout: 60 * 1000,
})

instanceApi.interceptors.request.use(
    config => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    },
    error => Promise.reject(error)
);

export const frigateApi = {
    getConfig: () => instanceApi.get<GetConfig[]>('apiv1/config').then(res => res.data),
    putConfig: (config: PutConfig[]) => instanceApi.put('apiv1/config', config).then(res => res.data),
    getHosts: () => instanceApi.get<GetFrigateHost[]>('apiv1/frigate-hosts').then(res => {
        return res.data
    }),
    getHost: (id: string) => instanceApi.get<GetFrigateHost>(`apiv1/frigate-hosts/${id}`).then(res => {
        return res.data
    }),
    getCamerasByHostId: (hostId: string) => instanceApi.get<GetCameraWHostWConfig[]>(`apiv1/cameras/host/${hostId}`).then(res => res.data),
    getCamerasWHost: () => instanceApi.get<GetCameraWHostWConfig[]>(`apiv1/cameras`).then(res => res.data),
    getCameraWHost: (id: string) => instanceApi.get<GetCameraWHostWConfig>(`apiv1/cameras/${id}`).then(res => { return res.data }),
    putHosts: (hosts: PutFrigateHost[]) => instanceApi.put<GetFrigateHost[]>('apiv1/frigate-hosts', hosts).then(res => {
        return res.data
    }),
    deleteHosts: (hosts: DeleteFrigateHost[]) => instanceApi.delete<GetFrigateHost[]>('apiv1/frigate-hosts', { data: hosts }).then(res => {
        return res.data
    }),
    getRoles: () => instanceApi.get<GetRole[]>('apiv1/roles').then(res => res.data),
    putRoleWCameras: (roleId: string, cameraIDs: string[]) => instanceApi.put<GetRoleWCameras>(`apiv1/roles/${roleId}/cameras`,
        {
            cameraIDs: cameraIDs
        }).then(res => res.data),
    getAdminRole: () => instanceApi.get<GetConfig>('apiv1/config/admin').then(res => res.data),
}

export const proxyPrefix = `${proxyURL.protocol}//${proxyURL.host}/proxy/`

export const proxyApi = {
    getHostConfigRaw: (hostName: string) => instanceApi.get(`proxy/${hostName}/api/config/raw`).then(res => res.data),
    getHostConfig: (hostName: string) => instanceApi.get(`proxy/${hostName}/api/config`).then(res => res.data),
    getImageFrigate: async (imageUrl: string) => {
        const response = await instanceApi.get<Blob>(imageUrl, {
            responseType: 'blob'
        })
        return response.data
    },
    getVideoFrigate: async (videoUrl: string, onProgress: (percentage: number | undefined) => void) => {
        const response = await instanceApi.get<Blob>(videoUrl, {
            responseType: 'blob',
            timeout: 10 * 60 * 1000,
            onDownloadProgress: (progressEvent) => {
                const total = progressEvent.total
                const current = progressEvent.loaded;
                const percentage = total ? (current / total) * 100 : undefined
                onProgress(percentage);
            },
        })
        return response.data
    },
    getHostRestart: (hostName: string) => instanceApi.get(`proxy/${hostName}/api/restart`).then(res => res.data),

    getRecordings: (
        hostName: string,
        cameraName: string,
        after: number,
        before: number
    ) =>
        instanceApi.get(`proxy/${hostName}/api/${cameraName}/recordings?after=${after}&before=${before}`).then(res => res.data),

    getRecordingsSummary: (
        hostName: string,
        cameraName: string,
        timezone: string,
    ) =>
        instanceApi.get<RecordSummary[]>(`proxy/${hostName}/api/${cameraName}/recordings/summary`, {
            params: { timezone },
            timeout: 5 * 60 * 1000
        }).then(res => res.data),

    // E.g. http://127.0.0.1:5000/api/events?before=1708534799&after=1708448400&camera=CameraName&has_clip=1&include_thumbnails=0&limit=5000
    getEvents: (
        hostName: string,
        camerasName: string[],
        timezone?: string,
        hasClip?: boolean,
        after?: number,
        before?: number,
        labels?: string[],
        limit: number = 5000,
        includeThumnails?: boolean,
        minScore?: number,
        maxScore?: number,
    ) =>
        instanceApi.get<EventFrigate[]>(`proxy/${hostName}/api/events`, {
            params: {
                cameras: camerasName.join(','), // frigate format
                timezone: timezone,
                after: after,
                before: before, // @before the last event start_time in list
                has_clip: hasClip,
                include_thumbnails: includeThumnails,
                labels: labels,
                limit: limit,
                min_score: minScore,
                max_score: maxScore,
            }
        }).then(res => res.data),

    getEventsSummary: (hostName: string, cameraName: string) =>
        instanceApi.get(`proxy/${hostName}/api/${cameraName}/events/summary`).then(res => res.data),
    cameraWsURL: (hostName: string, cameraName: string) =>
        `ws://${proxyURL.host}/proxy-ws/${hostName}/live/jsmpeg/${cameraName}`,
    cameraImageURL: (hostName: string, cameraName: string) =>
        `${proxyPrefix}${hostName}/api/${cameraName}/latest.jpg`,
    eventURL: (hostName: string, event: string) =>
        `${proxyPrefix}${hostName}/vod/event/${event}/master.m3u8`,
    eventThumbnailUrl: (hostName: string, eventId: string) => `${proxyPrefix}${hostName}/api/events/${eventId}/thumbnail.jpg`,
    eventDownloadURL: (hostName: string, eventId: string) => `${proxyPrefix}${hostName}/api/events/${eventId}/clip.mp4?download=true`,
    // http://127.0.0.1:5000/vod/2024-02/23/19/CameraName/Asia,Krasnoyarsk/master.m3u8
    recordingURL: (hostName: string, cameraName: string, timezone: string, day: string, hour: string) => {//  day:2024-02-23 hour:19
        const parts = day.split('-')
        const date = `${parts[0]}-${parts[1]}/${parts[2]}/${hour}`
        return `${proxyPrefix}${hostName}/vod/${date}/${cameraName}/${timezone}/master.m3u8`
    },
    postExportVideoTask: (hostName: string, cameraName: string, startUnixTime: number, endUnixTime: number) => {
        const url = `proxy/${hostName}/api/export/${cameraName}/start/${startUnixTime}/end/${endUnixTime}`
        return instanceApi.post(url, { playback: 'realtime' }).then(res => res.data) // Payload: {"playback":"realtime"}
    },
    getExportedVideoList: (hostName: string) => instanceApi.get<GetExportedFile[]>(`proxy/${hostName}/exports/`).then(res => res.data),
    getVideoUrl: (hostName: string, fileName: string) => `${proxyPrefix}${hostName}/exports/${fileName}`,
    // filename example Home_1_Backyard_2024_02_26_16_25__2024_02_26_16_26.mp4
    deleteExportedVideo: (hostName: string, videoName: string) => instanceApi.delete(`proxy/${hostName}/api/export/${videoName}`).then(res => res.data)
}

export const mapCamerasFromConfig = (config: FrigateConfig): string[] => {
    return Object.keys(config.cameras)
}

export const mapHostToHostname = (host?: GetFrigateHost): string | undefined => {
    if (!host) return
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
    getCameraByHostId: 'camera-by-hostId',
    getHostConfig: 'host-config',
    getRecordingsSummary: 'recordings-frigate-summary',
    getRecordings: 'recordings-frigate',
    getEvents: 'events-frigate',
    getRoles: 'roles',
    getRoleWCameras: 'roles-cameras',
    getUsersByRole: 'users-role',
    getAdminRole: 'admin-role',
}

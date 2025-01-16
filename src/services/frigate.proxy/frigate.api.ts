import axios from "axios"
import { proxyURL } from "../../shared/env.const"
import {
    GetConfig, DeleteFrigateHost, GetFrigateHost, PutConfig, PutFrigateHost,
    GetCameraWHostWConfig, GetRole,
    GetRoleWCameras, GetExportedFile, recordingSchema,
    oidpConfig,
    OIDPConfig,
    GetCameraWHost,
    GetCamera
} from "./frigate.schema";
import { FrigateConfig } from "../../types/frigateConfig";
import { RecordSummary } from "../../types/record";
import { EventFrigate } from "../../types/event";
import { getResolvedTimeZone } from "../../shared/utils/dateUtil";
import { FrigateStats, GetFfprobe, GetHostStorage, GetVaInfo } from "../../types/frigateStats";
import { PostSaveConfig, SaveOption } from "../../types/saveConfig";
import keycloakInstance from "../keycloak-config";
import { PutMask } from "../../types/mask";
import { GetUserTag, PutUserTag } from "../../types/tags";

const instanceApi = axios.create({
    baseURL: proxyURL.toString(),
    timeout: 20 * 1000,
})

instanceApi.interceptors.request.use(
    config => {
        const accessToken = keycloakInstance.token;
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config;
    },
    error => Promise.reject(error)
);

export const frigateApi = {
    getAllConfig: () => instanceApi.get<GetConfig[]>('apiv1/config').then(res => res.data),
    getConfig: (key: string) => instanceApi.get<GetConfig>(`apiv1/config/${key}`).then(res => res.data),
    getOIDPConfig: () => instanceApi.get<OIDPConfig>('apiv1/config/oidp').then(res => res.data),
    putConfigs: (config: PutConfig[]) => instanceApi.put('apiv1/config', config).then(res => res.data),
    putOIDPConfig: (config: OIDPConfig) => instanceApi.put('apiv1/config/oidp', config).then(res => res.data),
    putOIDPConfigTest: (config: OIDPConfig) => instanceApi.put('apiv1/config/oidp/test', config).then(res => res.data),
    getHosts: () => instanceApi.get<GetFrigateHost[]>('apiv1/frigate-hosts').then(res => res.data),
    getHost: (id: string) => instanceApi.get<GetFrigateHost>(`apiv1/frigate-hosts/${id}`).then(res => res.data),
    getCameraById: (cameraId: string) => instanceApi.get<GetCameraWHostWConfig>(`apiv1/cameras/${cameraId}`).then(res => res.data),
    getCamerasByHostId: (hostId: string) => instanceApi.get<GetCameraWHostWConfig[]>(`apiv1/cameras/host/${hostId}`).then(res => res.data),
    getCamerasWHost: () => instanceApi.get<GetCameraWHostWConfig[]>(`apiv1/cameras`).then(res => res.data),
    getCameraWHost: (id: string) => instanceApi.get<GetCameraWHostWConfig>(`apiv1/cameras/${id}`).then(res => res.data),
    putHosts: (hosts: PutFrigateHost[]) => instanceApi.put<GetFrigateHost[]>('apiv1/frigate-hosts', hosts).then(res => res.data),
    deleteHosts: (hosts: DeleteFrigateHost[]) => instanceApi.delete<GetFrigateHost[]>('apiv1/frigate-hosts', { data: hosts }).then(res => res.data),
    getRoles: () => instanceApi.get<GetRole[]>('apiv1/roles').then(res => res.data),
    putRoles: () => instanceApi.put<GetRole[]>('apiv1/roles').then(res => res.data),
    putRoleWCameras: (roleId: string, cameraIDs: string[]) => instanceApi.put<GetRoleWCameras>(`apiv1/roles/${roleId}/cameras`,
        {
            cameraIDs: cameraIDs
        }).then(res => res.data),
    getAdminRole: () => instanceApi.get<GetConfig>('apiv1/config/admin').then(res => res.data),
    getUserTags: () => instanceApi.get<GetUserTag[]>('apiv1/tags').then(res => res.data),
    putUserTag: (tag: PutUserTag) => instanceApi.put<GetUserTag>('apiv1/tags', tag).then(res => res.data),
    delUserTag: (tagId: string) => instanceApi.delete<GetUserTag>(`apiv1/tags/${tagId}`).then(res => res.data),
    putTagToCamera: (cameraId: string, tagId: string) => instanceApi.put<GetCamera>(`apiv1/cameras/${cameraId}/tag/${tagId}`).then(res => res.data),
    deleteTagFromCamera: (cameraId: string, tagId: string) => instanceApi.delete<GetCamera>(`apiv1/cameras/${cameraId}/tag/${tagId}`).then(res => res.data),
}

export const proxyPrefix = `${proxyURL.protocol}//${proxyURL.host}/proxy/`

export const proxyApi = {
    getHostConfigRaw: (hostName: string) => instanceApi.get(`proxy/${hostName}/api/config/raw`).then(res => res.data),
    getHostConfig: (hostName: string) => instanceApi.get(`proxy/${hostName}/api/config`).then(res => res.data),
    getImageFrigate: async (imageUrl: string, height?: number) => {
        const response = await instanceApi.get<Blob>(imageUrl, {
            params: {
                h: height
            },
            responseType: 'blob',
            timeout: 10 * 1000
        })
        return response.data
    },
    getVideoFrigate: async (videoUrl: string, onProgress: (percentage: number | undefined) => void) => {
        const response = await instanceApi.get<Blob>(videoUrl, {
            responseType: 'blob',
            timeout: 20 * 60 * 1000,
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
        abortSignal?: AbortSignal,
    ) =>
        instanceApi.get<RecordSummary[]>(`proxy/${hostName}/api/${cameraName}/recordings/summary`, {
            params: { timezone },
            timeout: 5 * 60 * 1000,
            signal: abortSignal
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
        abortSignal?: AbortSignal,
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
            },
            timeout: 5 * 60 * 1000,
            signal: abortSignal
        }).then(res => res.data),

    getEventsSummary: (hostName: string, cameraName: string) =>
        instanceApi.get(`proxy/${hostName}/api/${cameraName}/events/summary`).then(res => res.data),
    configSchemaURL: (hostName: string) => `${proxyPrefix}${hostName}/api/config/schema.json`,
    cameraWsURL: (hostName: string, cameraName: string) => {
        const protocol = proxyURL.protocol === 'https:' ? 'wss' : 'ws';
        return `${protocol}://${proxyURL.host}/proxy-ws/${hostName}/live/jsmpeg/${cameraName}`
    },
    cameraImageURL: (hostName: string, cameraName: string) =>
        `${proxyPrefix}${hostName}/api/${cameraName}/latest.jpg`,
    eventURL: (hostName: string, event: string) =>
        `${proxyPrefix}${hostName}/vod/event/${event}/master.m3u8`,
    eventThumbnailUrl: (hostName: string, eventId: string) => `${proxyPrefix}${hostName}/api/events/${eventId}/thumbnail.jpg`,
    eventDownloadURL: (hostName: string, eventId: string) => `${proxyPrefix}${hostName}/api/events/${eventId}/clip.mp4?download=true`,
    // http://127.0.0.1:5000/vod/2024-02/23/19/CameraName/Asia,Krasnoyarsk/master.m3u8
    recordingURL: (hostName?: string, cameraName?: string, timezone?: string, day?: string, hour?: string) => {//  day:2024-02-23 hour:19
        const record = {
            hostName: hostName,
            cameraName: cameraName,
            day: day,
            hour: hour,
            timezone: getResolvedTimeZone().replace('/', ','),
        }
        const parsed = recordingSchema.safeParse(record)
        if (parsed.success) {
            const parts = parsed.data.day.split('-')
            const date = `${parts[0]}-${parts[1]}/${parts[2]}/${hour}`
            return `${proxyPrefix}${hostName}/vod/${date}/${cameraName}/${timezone}/master.m3u8`
        }
        return undefined
    },
    postExportVideoTask: (hostName: string, cameraName: string, startUnixTime: number, endUnixTime: number) => {
        const url = `proxy/${hostName}/api/export/${cameraName}/start/${startUnixTime}/end/${endUnixTime}`
        return instanceApi.post(url, { playback: 'realtime' }).then(res => res.data) // Payload: {"playback":"realtime"}
    },
    getExportedVideoList: (hostName: string) => instanceApi.get<GetExportedFile[]>(`proxy/${hostName}/exports/`).then(res => res.data),
    getVideoUrl: (hostName: string, fileName: string) => `${proxyPrefix}${hostName}/exports/${fileName}`,
    // filename example Home_1_Backyard_2024_02_26_16_25__2024_02_26_16_26.mp4
    deleteExportedVideo: (hostName: string, videoName: string) => instanceApi.delete(`proxy/${hostName}/api/export/${videoName}`).then(res => res.data),
    getHostStats: (hostName: string) => instanceApi.get<FrigateStats>(`proxy/${hostName}/api/stats`).then(res => res.data),
    getCameraFfprobe: (hostName: string, cameraName: string) =>
        instanceApi.get<GetFfprobe[]>(`proxy/${hostName}/api/ffprobe`, { params: { paths: `camera:${cameraName}` } }).then(res => res.data),
    getHostVaInfo: (hostName: string) => instanceApi.get<GetVaInfo>(`proxy/${hostName}/api/vainfo`).then(res => res.data),
    postHostConfig: (hostName: string, saveOption: SaveOption, config: string) =>
        instanceApi.post<PostSaveConfig>(`proxy/${hostName}/api/config/save`, config, {
            headers: {
                'Content-Type': 'text/plain'
            },
            params: {
                save_option: saveOption
            }
        }).then(res => res.data),
    getHostStorage: (hostName: string) => instanceApi.get<GetHostStorage>(`proxy/${hostName}/api/recordings/storage`).then(res => res.data),
    putMotionMask: (hostName: string, cameraName: string, index: number, points: string) =>
        instanceApi
            .put<PutMask>(`proxy/${hostName}/api/config/set?cameras.${cameraName}.motion.mask.${index}=${points}`) // points format: 257,21,255,43,21,48,21,25
            .then(res => res.data),
    putZoneMask: (hostName: string, cameraName: string, zoneName: string, points: string) =>
        instanceApi
            .put<PutMask>(`proxy/${hostName}/api/config/set?cameras.${cameraName}.zones.${zoneName}.coordinates=${points}`) // points format: 257,21,255,43,21,48,21,25
            .then(res => res.data),
    putObjectMask: (hostName: string, cameraName: string, filterName: string, index: number, points: string) =>
        instanceApi
            .put<PutMask>(`proxy/${hostName}/api/config/set?cameras.${cameraName}.objects.filters.${filterName}.mask.${index}=${points}`) // points format: 257,21,255,43,21,48,21,25
            .then(res => res.data),
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
    getAllConfig: 'getAllConfig',
    getConfig: 'getConfig',
    getOIDPConfig: 'OIDPconfig',
    getFrigateHosts: 'frigate-hosts',
    getFrigateHostsConfigs: 'frigate-hosts-configs',
    getFrigateHost: 'frigate-host',
    getCamerasWHost: 'cameras-frigate-host',
    getCameraWHost: 'camera-frigate-host',
    getCameraById: 'camera-by-Id',
    getCameraByHostId: 'camera-by-hostId',
    getHostConfig: 'host-config',
    postHostConfig: 'host-config-save',
    getHostStats: 'host-stats',
    getCameraFfprobe: 'camera-ffprobe',
    getHostVaInfo: 'host-vainfo',
    getHostStorage: 'host-storage',
    getRecordingsSummary: 'recordings-frigate-summary',
    getRecordings: 'recordings-frigate',
    getEvents: 'events-frigate',
    getRoles: 'roles',
    putRoles: 'putRoles',
    getRoleWCameras: 'roles-cameras',
    getUsersByRole: 'users-role',
    getAdminRole: 'admin-role',
    getUserTags: 'users-tags',
    putUserTag: 'put-user-tag',
}

import axios from "axios"
import { proxyURL } from "../../shared/env.const"
import { z } from "zod"
import {
    GetConfig, DeleteFrigateHost, GetFrigateHost, PutConfig, PutFrigateHost,
    GetFrigateHostWithCameras, GetCameraWHost, GetCameraWHostWConfig, GetRole,
    GetUserByRole, GetRoleWCameras
} from "./frigate.schema";
import { FrigateConfig } from "../../types/frigateConfig";
import { url } from "inspector";
import { RecordSummary } from "../../types/record";
import { EventFrigate } from "../../types/event";


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
    getHostsWithCameras: () => instanceApi.get<GetFrigateHostWithCameras[]>('apiv1/frigate-hosts', { params: { include: 'cameras' } }).then(res => {
        return res.data
    }),
    getHost: (id: string) => instanceApi.get<GetFrigateHostWithCameras>(`apiv1/frigate-hosts/${id}`).then(res => {
        return res.data
    }),
    getCamerasWHost: () => instanceApi.get<GetCameraWHostWConfig[]>(`apiv1/cameras`).then(res => res.data),
    getCameraWHost: (id: string) => instanceApi.get<GetCameraWHostWConfig>(`apiv1/cameras/${id}`).then(res => { return res.data }),
    putHosts: (hosts: PutFrigateHost[]) => instanceApi.put<GetFrigateHost[]>('apiv1/frigate-hosts', hosts).then(res => {
        return res.data
    }),
    deleteHosts: (hosts: DeleteFrigateHost[]) => instanceApi.delete<GetFrigateHost[]>('apiv1/frigate-hosts', { data: hosts }).then(res => {
        return res.data
    }),
    getRoles: () => instanceApi.get<GetRole[]>('apiv1/roles').then(res => res.data),
    getUsersByRole: (roleName: string) => instanceApi.get<GetUserByRole[]>(`apiv1/users/${roleName}`).then(res => res.data),
    getRoleWCameras: (roleId: string) => instanceApi.get<GetRoleWCameras>(`apiv1/roles/${roleId}`).then(res => res.data),
    putRoleWCameras: (roleId: string, cameraIDs: string[]) => instanceApi.put<GetRoleWCameras>(`apiv1/roles/${roleId}/cameras`,
        {
            cameraIDs: cameraIDs
        }).then(res => res.data)
}

export const proxyApi = {
    getHostConfigRaw: (hostName: string) => instanceApi.get(`proxy/${hostName}/api/config/raw`).then(res => res.data),
    getHostConfig: (hostName: string) => instanceApi.get(`proxy/${hostName}/api/config`).then(res => res.data),
    getImageFrigate: async (imageUrl: string) => {
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.blob();
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
        instanceApi.get<RecordSummary[]>(`proxy/${hostName}/api/${cameraName}/recordings/summary`, { params: { timezone } }).then(res => res.data),

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
    getEventsInProgress: (hostName: string) => instanceApi.get(`proxy/${hostName}/api/events?in_progress=1&include_thumbnails=0`),
    cameraWsURL: (hostName: string, cameraName: string) =>
        `ws://${proxyURL.host}/proxy-ws/${hostName}/live/jsmpeg/${cameraName}`,
    cameraImageURL: (hostName: string, cameraName: string) =>
        `${proxyURL.protocol}//${proxyURL.host}/proxy/${hostName}/api/${cameraName}/latest.jpg`,
    eventURL: (hostName: string, event: string) =>
        `${proxyURL.protocol}//${proxyURL.host}/proxy/${hostName}/vod/event/${event}/master.m3u8`,
    // http://127.0.0.1:5000/vod/2024-02/23/19/CameraName/Asia,Krasnoyarsk/master.m3u8
    recordingURL: (hostName: string, cameraName: string, timezone: string, day: string, hour: string) => {//  day:2024-02-23 hour:19
        const parts = day.split('-')
        const date = `${parts[0]}-${parts[1]}/${parts[2]}/${hour}`
        return `${proxyURL.protocol}//${proxyURL.host}/proxy/${hostName}/vod/${date}/${cameraName}/${timezone}/master.m3u8` // todo add Date/Time
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
    getRecordingsSummary: 'recordings-frigate-summary',
    getRecordings: 'recordings-frigate',
    getEvents: 'events-frigate',
    getRoles: 'roles',
    getRoleWCameras: 'roles-cameras',
    getUsersByRole: 'users-role',
}

import React, { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { Context } from '..';
import { useAdminRole } from '../hooks/useAdminRole';
import Forbidden from './403';
import { observer } from 'mobx-react-lite';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { frigateApi, frigateQueryKeys, mapHostToHostname, proxyApi } from '../services/frigate.proxy/frigate.api';
import CenterLoader from '../shared/components/loaders/CenterLoader';
import RetryErrorPage from './RetryErrorPage';
import { Flex } from '@mantine/core';
import FrigateCamerasStateTable, { CameraItem, ProcessType } from '../widgets/camera.stat.table/FrigateCameraStateTable';

export const hostSystemPageQuery = {
    hostId: 'hostId',
}

const HostSystemPage = () => {
    const executed = useRef(false)
    const { sideBarsStore } = useContext(Context)
    const { isAdmin } = useAdminRole()

    useEffect(() => {
        if (!executed.current) {
            sideBarsStore.rightVisible = false
            sideBarsStore.setLeftChildren(null)
            sideBarsStore.setRightChildren(null)
            executed.current = true
        }
    }, [sideBarsStore])

    const location = useLocation()
    const queryParams = useMemo(() => {
        return new URLSearchParams(location.search);
    }, [location.search])

    let { id: paramHostId } = useParams<'id'>()

    const { data, isError, isPending, refetch } = useQuery({
        queryKey: [frigateQueryKeys.getHostStats, paramHostId],
        queryFn: async () => {
            if (!paramHostId) return null
            const host = await frigateApi.getHost(paramHostId)
            const hostName = mapHostToHostname(host)
            if (!hostName) return null
            return proxyApi.getHostStats(hostName)
        }
    })

    const mapCameraData = useCallback(() => {
        if (!data) return []
        return Object.entries(data.cameras).flatMap(([name, stats]) => {
            return (['Ffmpeg', 'Capture', 'Detect'] as ProcessType[]).map(type => {
                const pid = type === ProcessType.Ffmpeg ? stats.ffmpeg_pid :
                            type === ProcessType.Capture ? stats.capture_pid : stats.pid;
                const fps = type === ProcessType.Ffmpeg ? stats.camera_fps :
                            type === ProcessType.Capture ? stats.process_fps : stats.detection_fps;
                const cpu = data.cpu_usages[pid]?.cpu;
                const mem = data.cpu_usages[pid]?.mem;
                
                return {
                    cameraName: name,
                    process: type,
                    pid: pid,
                    fps: fps,
                    cpu: cpu ?? 0,
                    mem: mem ?? 0,
                };
            });
        });
    }, [data]);

    if (!isAdmin) return <Forbidden />
    if (isPending) return <CenterLoader />
    if (isError) return <RetryErrorPage onRetry={refetch} />
    if (!paramHostId || !data) return null

    const mappedCameraStat: CameraItem[] = mapCameraData()

    return (
        <Flex w='100%' h='100%'>
            <FrigateCamerasStateTable data={mappedCameraStat} />
        </Flex>
    );
};

export default observer(HostSystemPage);
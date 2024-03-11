import { Flex, Grid, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { useCallback, useContext, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Context } from '..';
import { useAdminRole } from '../hooks/useAdminRole';
import { frigateApi, frigateQueryKeys, mapHostToHostname, proxyApi } from '../services/frigate.proxy/frigate.api';
import { GetFrigateHost } from '../services/frigate.proxy/frigate.schema';
import CenterLoader from '../shared/components/loaders/CenterLoader';
import DetectorsStat from '../shared/components/stats/DetectorsStat';
import GpuStat from '../shared/components/stats/GpuStat';
import StorageRingStat from '../shared/components/stats/StorageRingStat';
import { isProduction } from '../shared/env.const';
import { formatUptime } from '../shared/utils/dateUtil';
import FrigateCamerasStateTable, { CameraItem, ProcessType } from '../widgets/camera.stat.table/FrigateCameraStateTable';
import Forbidden from './403';
import RetryErrorPage from './RetryErrorPage';
import { openContextModal } from '@mantine/modals';
import { FfprobeModalProps } from '../shared/components/modal.windows/FfprobeModal';

export const hostSystemPageQuery = {
    hostId: 'hostId',
}

const HostSystemPage = () => {
    const { t } = useTranslation()
    const executed = useRef(false)
    const { sideBarsStore } = useContext(Context)
    const { isAdmin } = useAdminRole()
    const host = useRef<GetFrigateHost | undefined>()

    useEffect(() => {
        if (!executed.current) {
            sideBarsStore.rightVisible = false
            sideBarsStore.setLeftChildren(null)
            sideBarsStore.setRightChildren(null)
            executed.current = true
        }
    }, [sideBarsStore])

    let { id: paramHostId } = useParams<'id'>()

    const { data, isError, isPending, refetch } = useQuery({
        queryKey: [frigateQueryKeys.getHostStats, paramHostId],
        queryFn: async () => {
            if (!paramHostId) return null
            host.current = await frigateApi.getHost(paramHostId)
            const hostName = mapHostToHostname(host.current)
            if (!hostName) return null
            return proxyApi.getHostStats(hostName)
        },
        staleTime: 2 * 60 * 1000,
        refetchInterval: 60 * 1000,
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

    if (isPending) return <CenterLoader />
    if (isError) return <RetryErrorPage onRetry={refetch} />
    if (!isAdmin) return <Forbidden />
    if (!paramHostId || !data) return null

    const mappedCameraStat: CameraItem[] = mapCameraData()
    const storageStats = Object.entries(data.service.storage).map(([name, stats]) => {
        return (
            <Grid.Col key={name + stats.mount_type} xs={6} sm={5} md={4} lg={3} p='0.2rem'>
                <StorageRingStat
                    used={stats.used}
                    free={stats.free}
                    storageType={stats.mount_type}
                    total={stats.total}
                    path={name} />
            </Grid.Col>
        )
    })

    const formattedUptime = () => {
        const time = formatUptime(data.service.uptime)
        const translatedUnit = t(time.unit).toLowerCase().slice(0, 1)
        return `${time.value.toFixed(1)} ${translatedUnit}`
    }

    const handleVaInfoClick = () => openContextModal({
        modal: 'vaInfoModal',
        title: 'VaInfo',
        innerProps: {
            hostName: mapHostToHostname(host.current)
        }
    })

    const gpuStats = Object.entries(data.gpu_usages).map(([name, stats]) => {
        return (
            <Grid.Col key={name + stats.gpu} xs={7} sm={6} md={5} lg={4} p='0.2rem'>
                <GpuStat
                    name={name}
                    decoder={stats.dec}
                    encoder={stats.enc}
                    gpu={stats.gpu}
                    mem={stats.mem} 
                    onVaInfoClick={() => handleVaInfoClick()}
                    />
            </Grid.Col>
        )
    })

    const detectorsStats = Object.entries(data.detectors).map(([name, stats]) => {
        const pid = stats.pid
        const cpu = data.cpu_usages[pid]?.cpu;
        const mem = data.cpu_usages[pid]?.mem;
        return (
            <Grid.Col key={pid} xs={6} sm={5} md={4} lg={3} p='0.2rem'>
                <DetectorsStat
                    name={name}
                    pid={pid}
                    inferenceSpeed={stats.inference_speed}
                    cpu={cpu}
                    mem={mem}
                />
            </Grid.Col>
        )
    })

    const handleFfprobeClick = (cameraName: string) => openContextModal({
        modal: 'ffprobeModal',
        title: 'Ffprobe',
        innerProps: {
            hostName: mapHostToHostname(host.current),
            cameraName: cameraName
        }
    })

    if (!isProduction) console.log('HostSystemPage rendered')

    return (
        <Flex w='100%' h='100%' direction='column'>
            <Flex w='100%' justify='space-around' align='baseline'>
                <Text>{t('version')} : {data.service.version}</Text>
                <Text size='xl' w='900'>{host.current?.name}</Text>
                <Text>{t('uptime')} : {formattedUptime()}</Text>
            </Flex>
            <Grid mt='sm' justify="center" mb='sm' align='stretch'>
                {storageStats}
            </Grid>
            <Grid mt='sm' justify="center" mb='sm' align='stretch'>
                {gpuStats}
                {detectorsStats}
            </Grid>
            <FrigateCamerasStateTable data={mappedCameraStat} onFfprobeClick={handleFfprobeClick} />
        </Flex>
    );
};

export default observer(HostSystemPage);
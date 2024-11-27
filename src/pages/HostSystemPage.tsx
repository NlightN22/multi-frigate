import { Flex, Grid, SegmentedControl, Text } from '@mantine/core';
import { openContextModal } from '@mantine/modals';
import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
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
import FrigateStorageStateTable from '../widgets/camera.stat.table/FrigateStorageStateTable';
import Forbidden from './403';
import RetryErrorPage from './RetryErrorPage';

export const hostSystemPageQuery = {
    hostId: 'hostId',
}

enum SelectorItems {
    Cameras = 'cameras',
    Storage = 'storage'
}

const HostSystemPage = () => {
    const { t } = useTranslation()
    const { isAdmin } = useAdminRole()
    const host = useRef<GetFrigateHost | undefined>()
    const [selector, setSelector] = useState(SelectorItems.Cameras)

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
        if (!data || !data.cameras) return []
        return Object.entries(data.cameras).flatMap(([name, stats]) => {
            return (['Ffmpeg', 'Capture', 'Detect'] as ProcessType[]).map(type => {
                const pid = type === ProcessType.Ffmpeg ? stats.ffmpeg_pid :
                    type === ProcessType.Capture ? stats.capture_pid : stats.pid;
                const fps = type === ProcessType.Ffmpeg ? stats.camera_fps :
                    type === ProcessType.Capture ? stats.process_fps : stats.detection_fps;
                const cpu = data.cpu_usages ? data.cpu_usages[pid]?.cpu : '0'
                const mem = data.cpu_usages ? data.cpu_usages[pid]?.mem : '0'

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

    const gpuStats = () => {
        if (!data?.gpu_usages) return null

        return Object.entries(data.gpu_usages).map(([name, stats]) => (
            <Grid.Col key={`${name}-${stats.gpu}`} xs={7} sm={6} md={5} lg={4} p="0.2rem">
                <GpuStat
                    name={name}
                    decoder={stats.dec}
                    encoder={stats.enc}
                    gpu={stats.gpu}
                    mem={stats.mem}
                    onVaInfoClick={handleVaInfoClick}
                />
            </Grid.Col>
        ))
    }

    const detectorsStats = () => {
        if (!data?.detectors) return null

        return Object.entries(data.detectors).map(([name, stats]) => {
            const pid = stats.pid
            const cpu = data.cpu_usages ? data.cpu_usages[pid]?.cpu : '0'
            const mem = data.cpu_usages ? data.cpu_usages[pid]?.mem : '0'
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
    }

    const handleFfprobeClick = (cameraName: string) => openContextModal({
        modal: 'ffprobeModal',
        title: 'Ffprobe',
        innerProps: {
            hostName: mapHostToHostname(host.current),
            cameraName: cameraName
        }
    })

    const handleSelectView = (value: string) => {
        if (value === SelectorItems.Cameras) setSelector(SelectorItems.Cameras)
        else setSelector(SelectorItems.Storage)
    }

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
                {gpuStats()}
                {detectorsStats()}
            </Grid>
            <SegmentedControl
                value={selector}
                onChange={handleSelectView}
                data={[
                    { label: t('systemPage.cameraStats'), value: SelectorItems.Cameras },
                    { label: t('systemPage.storageStats'), value: SelectorItems.Storage },
                ]}
            />
            {selector === SelectorItems.Cameras ?
                <FrigateCamerasStateTable data={mappedCameraStat} onFfprobeClick={handleFfprobeClick} />
                :
                <FrigateStorageStateTable host={host.current} />
            }
        </Flex>
    );
};

export default observer(HostSystemPage);
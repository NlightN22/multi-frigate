import { Container, Flex, Grid, Group, Skeleton, Text } from '@mantine/core';
import ProductTable, { TableAdapter } from '../widgets/ProductTable';
import HeadSearch from '../shared/components/HeadSearch';
import ViewSelector, { SelectorViewState } from '../shared/components/ViewSelector';
import { useContext, useState, useEffect } from 'react';
import ProductGrid, { GridAdapter } from '../shared/components/grid.aps/ProductGrid';
import { getCookie, setCookie } from 'cookies-next';
import { Context } from '..';
import { observer } from 'mobx-react-lite'
import CenterLoader from '../shared/components/CenterLoader';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { frigateApi, frigateQueryKeys, mapHostToHostname } from '../services/frigate.proxy/frigate.api';
import RetryError from './RetryError';
import { CameraConfig, FrigateConfig } from '../types/frigateConfig';
import { GetFrigateHostWConfig } from '../services/frigate.proxy/frigate.schema';
import { host } from '../shared/env.const';
import AutoUpdatingCameraImage from '../shared/components/frigate/AutoUpdatingCameraImage';
import CameraCard from '../shared/components/CameraCard';




const MainBody = observer(() => {
    const { sideBarsStore } = useContext(Context)
    useEffect(() => {
        sideBarsStore.rightVisible = false
        sideBarsStore.setLeftChildren(null)
        sideBarsStore.setRightChildren(null)
    }, [])

    const [viewState, setTableState] = useState(getCookie('aps-main-view') as SelectorViewState || SelectorViewState.GRID)
    const handleToggleState = (state: SelectorViewState) => {
        setCookie('aps-main-view', state, { maxAge: 60 * 60 * 24 * 30 });
        setTableState(state)
    }

    const { data: hosts, isPending, isError, refetch } = useQuery({
        queryKey: [frigateQueryKeys.getFrigateHostsConfigs],
        queryFn: async () => {
            const hosts = await frigateApi.getHosts()
            let fetchedConfigs = []
            for (const host of hosts) {
                if (host.enabled) {
                    const hostName = mapHostToHostname(host)
                    const config: FrigateConfig = await frigateApi.getHostConfig(hostName)
                    if (config) {
                        const hostWConfig: GetFrigateHostWConfig = { config: config, ...host }
                        fetchedConfigs.push(hostWConfig)
                    }
                }
            }
            return fetchedConfigs
        }
    })

    if (isPending) return <CenterLoader />

    if (isError) return <RetryError onRetry={refetch} />


    // const child = () => {
    //    return ( <Skeleton mih='20rem' miw='20rem' radius="md" animate={false} /> )
    // }

    const cards = (host: GetFrigateHostWConfig) => {
        return Object.entries(host.config.cameras).map(
            ([cameraName, cameraConfig]) => (
                <CameraCard
                    key={host.id + cameraName}
                    cameraName={cameraName}
                    hostName={host.name}
                    cameraConfig={cameraConfig}
                    imageUrl={frigateApi.cameraImageURL(mapHostToHostname(host), cameraName)} />))
    }

    return (
        <Flex direction='column' h='100%'>
            <Flex justify='space-between' align='center' w='100%'>
                <Group
                    w='25%'
                >
                </Group>
                <Group
                    w='50%'
                    style={{
                        justifyContent: 'center',
                    }}
                ><HeadSearch /></Group>
                <Group
                    w='25%'
                    position="right">
                    <ViewSelector state={viewState} onChange={handleToggleState} />
                </Group>
            </Flex>
            <Flex justify='center' h='100%' direction='column'>
                {hosts.map(host => (
                    <Grid mt='sm' key={host.id} justify="center" mb='sm' align='stretch'>
                        {cards(host)}
                    </Grid>
                ))}
            </Flex>
        </Flex>
    );
})

export default MainBody;
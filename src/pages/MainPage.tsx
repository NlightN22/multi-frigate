import { Flex, Grid, Group } from '@mantine/core';
import HeadSearch from '../shared/components/HeadSearch';
import ViewSelector, { SelectorViewState } from '../shared/components/ViewSelector';
import { useContext, useState, useEffect } from 'react';
import { getCookie, setCookie } from 'cookies-next';
import { Context } from '..';
import { observer } from 'mobx-react-lite'
import CenterLoader from '../shared/components/CenterLoader';
import { useQuery } from '@tanstack/react-query';
import { frigateApi, frigateQueryKeys } from '../services/frigate.proxy/frigate.api';
import RetryErrorPage from './RetryErrorPage';
import CameraCard from '../shared/components/CameraCard';

const MainPage = () => {
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

    const { data: cameras, isPending, isError, refetch } = useQuery({
        queryKey: [frigateQueryKeys.getCamerasWHost],
        queryFn: frigateApi.getCamerasWHost
    })

    if (isPending) return <CenterLoader />

    if (isError) return <RetryErrorPage onRetry={refetch} />

    const cards = () => {
        return cameras.filter(cam => cam.frigateHost?.host.includes('5000')).slice(0,25).map(camera => (
        // return cameras.map(camera => (
            <CameraCard
                key={camera.id}
                camera={camera}
            />)
        )
    }

    return (
        <Flex direction='column' h='100%' >
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
            <Flex  justify='center' h='100%' direction='column' >
                <Grid mt='sm' justify="center" mb='sm' align='stretch'>
                    {cards()}
                </Grid>
            </Flex>
        </Flex>
    );
}

export default observer(MainPage);
import { Flex, Grid, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Context } from '..';
import { frigateApi, frigateQueryKeys } from '../services/frigate.proxy/frigate.api';
import { GetCameraWHostWConfig } from '../services/frigate.proxy/frigate.schema';
import CenterLoader from '../shared/components/loaders/CenterLoader';
import CameraCard from '../widgets/CameraCard';
import RetryErrorPage from './RetryErrorPage';

const MainPage = () => {
    const executed = useRef(false)
    const { sideBarsStore } = useContext(Context)
    const [searchQuery, setSearchQuery] = useState<string>()
    const [filteredCameras, setFilteredCameras] = useState<GetCameraWHostWConfig[]>()

    const { data: cameras, isPending, isError, refetch } = useQuery({
        queryKey: [frigateQueryKeys.getCamerasWHost],
        queryFn: frigateApi.getCamerasWHost
    })

    useEffect(() => {
        if (searchQuery && cameras) {
            setFilteredCameras(cameras.filter(camera => camera.name.toLowerCase().includes(searchQuery.toLowerCase())))
        } else {
            setFilteredCameras(undefined)
        }
    }, [searchQuery, cameras])

    useEffect(() => {
        if (!executed.current) {
            sideBarsStore.rightVisible = false
            sideBarsStore.setLeftChildren(null)
            sideBarsStore.setRightChildren(null)
            executed.current = true
        }
    }, [sideBarsStore])

    const cards = useMemo(() => {
        if (filteredCameras)
            return filteredCameras.filter(camera => {
                if (camera.frigateHost && !camera.frigateHost.enabled) return false
                return true
            }).map(camera => (
                <CameraCard
                    key={camera.id}
                    camera={camera}
                />)
            )
        else if (cameras)
            return cameras.filter(camera => {
                if (camera.frigateHost && !camera.frigateHost.enabled) return false
                return true
            }).map(camera => (
                <CameraCard
                    key={camera.id}
                    camera={camera}
                />)
            )
        else return []
    }, [cameras, filteredCameras])

    if (isPending) return <CenterLoader />

    if (isError) return <RetryErrorPage onRetry={refetch} />

    return (
        <Flex direction='column' h='100%' w='100%' >
            <Flex justify='space-between' align='center' w='100%'>
                <Flex w='100%'
                    style={{
                        justifyContent: 'center',
                    }}
                >
                    <TextInput
                        maw={400}
                        style={{ flexGrow: 1 }}
                        placeholder="Search..."
                        icon={<IconSearch size="0.9rem" stroke={1.5} />}
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.currentTarget.value)}
                    />
                </Flex>
            </Flex>
            <Flex justify='center' h='100%' direction='column' w='100%' >
                <Grid mt='sm' justify="center" mb='sm' align='stretch'>
                    {cards}
                </Grid>
            </Flex>
        </Flex>
    );
}

export default observer(MainPage);
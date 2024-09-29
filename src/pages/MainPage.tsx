import { Flex, Grid } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Context } from '..';
import { useRealmUser } from '../hooks/useRealmUser';
import { frigateApi, frigateQueryKeys } from '../services/frigate.proxy/frigate.api';
import { GetCameraWHostWConfig } from '../services/frigate.proxy/frigate.schema';
import CenterLoader from '../shared/components/loaders/CenterLoader';
import { isProduction } from '../shared/env.const';
import CameraCard from '../widgets/CameraCard';
import MainFiltersRightSide from '../widgets/sidebars/MainFiltersRightSide';
import { SideBarContext } from '../widgets/sidebars/SideBarContext';
import RetryErrorPage from './RetryErrorPage';
import { IconSearch } from '@tabler/icons-react';
import ClearableTextInput from '../shared/components/inputs/ClearableTextInput';

const MainPage = () => {
    const { t } = useTranslation()
    const { mainStore } = useContext(Context)
    const { setChildrenComponent } = useContext(SideBarContext)
    const { selectedHostId } = mainStore
    const [searchQuery, setSearchQuery] = useState<string>()
    const [filteredCameras, setFilteredCameras] = useState<GetCameraWHostWConfig[]>()

    const realmUser = useRealmUser()
    if (!isProduction) console.log('Realmuser:', realmUser)

    const { data: cameras, isPending, isError, refetch } = useQuery({
        queryKey: [frigateQueryKeys.getCamerasWHost],
        queryFn: frigateApi.getCamerasWHost
    })

    useEffect(() => {
        setChildrenComponent(<MainFiltersRightSide />);
        return () => setChildrenComponent(null);
    }, []);

    useEffect(() => {
        if (!cameras) {
            setFilteredCameras(undefined)
            return
        }

        const filterCameras = (camera: GetCameraWHostWConfig) => {
            const matchesHostId = selectedHostId ? camera.frigateHost?.id === selectedHostId : true
            const matchesSearchQuery = searchQuery ? camera.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
            return matchesHostId && matchesSearchQuery
        }

        setFilteredCameras(cameras.filter(filterCameras))
    }, [searchQuery, cameras, selectedHostId])


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

    if (!isProduction) console.log('MainPage rendered')

    return (
        <Flex direction='column' h='100%' w='100%' >
            <Flex w='100%'
                justify='center'
            >
                <ClearableTextInput
                    clerable
                    maw={400}
                    style={{ flexGrow: 1 }}
                    placeholder={t('search')}
                    icon={<IconSearch size="0.9rem" stroke={1.5} />}
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.currentTarget.value)}
                />
            </Flex>
            <Flex justify='center' h='100%' direction='column' w='100%' >
                <Grid mt='sm' justify="center" mb='sm' align='stretch'>
                    {/* TODO DELETE SLICE TO WORK */}
                    {cards.slice(0, 5)}
                </Grid>
            </Flex>
        </Flex>
    );
}

export default observer(MainPage);
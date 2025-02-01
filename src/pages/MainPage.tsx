import { Flex, Grid } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { ChangeEvent, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Context } from '..';
import { useDebounce } from '../hooks/useDebounce';
import { useRealmUser } from '../hooks/useRealmUser';
import { frigateApi, frigateQueryKeys } from '../services/frigate.proxy/frigate.api';
import { GetCameraWHostWConfig } from '../services/frigate.proxy/frigate.schema';
import ClearableTextInput from '../shared/components/inputs/ClearableTextInput';
import CenterLoader from '../shared/components/loaders/CenterLoader';
import { isProduction } from '../shared/env.const';
import MainFiltersRightSide from '../widgets/sidebars/MainFiltersRightSide';
import { SideBarContext } from '../widgets/sidebars/SideBarContext';
import RetryErrorPage from './RetryErrorPage';
import CameraCard from '../widgets/card/CameraCard';
import { useInView } from 'react-intersection-observer';

export const mainPageParams = {
    hostId: 'hostId',
    selectedTags: 'selectedTags',
    searchQuery: 'searchQuery',
}

const MainPage = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { mainStore } = useContext(Context)
    const [searchParams] = useSearchParams()

    const { setRightChildren } = useContext(SideBarContext)
    const { hostId: selectedHostId, selectedTags, searchQuery } = mainStore.filters
    const [filteredCameras, setFilteredCameras] = useState<GetCameraWHostWConfig[]>([])

    const { ref, inView } = useInView({ threshold: 0.5 })
    const [visibleCameras, setVisibleCameras] = useState<GetCameraWHostWConfig[]>([])

    const realmUser = useRealmUser()
    if (!isProduction) console.log('Realmuser:', realmUser)

    const { data: cameras, isPending, isError, refetch } = useQuery({
        queryKey: [frigateQueryKeys.getCamerasWHost],
        queryFn: frigateApi.getCamerasWHost
    })

    useEffect(() => {
        const pageSize = 20; 
        if (inView && filteredCameras.length > visibleCameras.length) {
            const nextBatch = filteredCameras.slice(visibleCameras.length, visibleCameras.length + pageSize);
            setVisibleCameras(prev => [...prev, ...nextBatch]);
        }
    }, [inView, filteredCameras, visibleCameras]);

    useEffect(() => {
        const hostId = searchParams.get(mainPageParams.hostId) || ''
        const searchQuery = searchParams.get(mainPageParams.searchQuery) || ''
        const selectedTags = mainStore.getArrayParam(mainPageParams.selectedTags)
        mainStore.setHostId(hostId, navigate)
        mainStore.setSearchQuery(searchQuery, navigate)
        mainStore.setSelectedTags(selectedTags, navigate)
    }, [searchParams])

    useEffect(() => {
        const deSerializedTags = mainStore.getArrayParam(mainPageParams.selectedTags)
        mainStore.loadFiltersFromPage({
            hostId: searchParams.get(mainPageParams.hostId) || undefined,
            searchQuery: searchParams.get(mainPageParams.searchQuery) || undefined,
            selectedTags: deSerializedTags,
        })

        setRightChildren(<MainFiltersRightSide />);
        return () => setRightChildren(null);
    }, []);

    useEffect(() => {
        if (!cameras) {
            setFilteredCameras([])
            return
        }

        const filterCameras = (camera: GetCameraWHostWConfig) => {
            const matchesHostId = selectedHostId ? camera.frigateHost?.id === selectedHostId : true
            const matchesSearchQuery = searchQuery ? camera.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
            const matchesTags = selectedTags ? selectedTags.length === 0 || camera.tags.some(tag => selectedTags.includes(tag.id)) : true
            return matchesHostId && matchesSearchQuery && matchesTags
        }

        setFilteredCameras(cameras.filter(filterCameras))
        setVisibleCameras([])
    }, [searchQuery, cameras, selectedHostId, selectedTags])


    const debouncedHandleSearchQuery = useDebounce((value: string) => {
        mainStore.setSearchQuery(value, navigate);
    }, 600);

    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        debouncedHandleSearchQuery(event.currentTarget.value)
    }

    if (isPending) return <CenterLoader />

    if (isError) return <RetryErrorPage onRetry={refetch} />

    if (!isProduction) console.log('MainPage rendered')

    return (
        <Flex direction='column' h='100%' w='100%' >
            <Flex w='100%'
                justify='center'
            >
                <ClearableTextInput
                    clearable
                    maw={400}
                    style={{ flexGrow: 1 }}
                    placeholder={t('search')}
                    icon={<IconSearch size="0.9rem" stroke={1.5} />}
                    value={searchQuery || undefined}
                    onChange={onInputChange}
                />
            </Flex>
            <Flex justify='center' h='100%' direction='column' w='100%' >
                <Grid mt='sm' justify="center" mb='sm' align='stretch'>
                    {visibleCameras.map(camera => (
                        <CameraCard key={camera.id} camera={camera} />
                    ))}
                </Grid>
                <div ref={ref} style={{ height: '50px' }} /> {/* trigger point */}
            </Flex>
        </Flex>
    );
}

export default observer(MainPage);
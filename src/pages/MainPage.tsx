import { Flex, Grid } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Context } from '..';
import { useDebounce } from '../hooks/useDebounce';
import { useRealmUser } from '../hooks/useRealmUser';
import { frigateApi, frigateQueryKeys } from '../services/frigate.proxy/frigate.api';
import { GetCameraWHostWConfig } from '../services/frigate.proxy/frigate.schema';
import ClearableTextInput from '../shared/components/inputs/ClearableTextInput';
import CenteredCogwheelLoader from '../shared/components/loaders/CenteredCogwheelLoader';
import CogwheelLoader from '../shared/components/loaders/CogwheelLoader';
import { isProduction } from '../shared/env.const';
import CameraCard from '../widgets/card/CameraCard';
import MainFiltersRightSide from '../widgets/sidebars/MainFiltersRightSide';
import { SideBarContext } from '../widgets/sidebars/SideBarContext';
import RetryErrorPage from './RetryErrorPage';

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

    const { ref, inView } = useInView({ threshold: 0.5 })

    const realmUser = useRealmUser()
    if (!isProduction) console.log('Realmuser:', realmUser)
    const loadTriggered = useRef(false);

    const pageSize = 20;

    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        refetch,
    } = useInfiniteQuery<GetCameraWHostWConfig[]>({
        queryKey: [frigateQueryKeys.getCamerasWHost, selectedHostId, searchQuery, selectedTags],
        queryFn: ({ pageParam = 0 }) =>
            // Pass pagination parameters to the backend
            frigateApi.getCamerasWHost({
                name: searchQuery,
                frigateHostId: selectedHostId,
                tagIds: selectedTags,
                offset: pageParam,
                limit: pageSize,
            }),
        getNextPageParam: (lastPage, pages) => {
            // If last page size is less than pageSize, no more pages
            if (lastPage.length < pageSize) return undefined;
            // Next page offset is pages.length * pageSize
            return pages.length * pageSize;
        },
        initialPageParam: 0,
    });

    const cameras: GetCameraWHostWConfig[] = data?.pages.flat() || [];
    // const cameras: GetCameraWHostWConfig[] = [];

    const [visibleCount, setVisibleCount] = useState(pageSize)

    useEffect(() => {
        if (inView && !isFetching) {
            if (visibleCount < cameras.length) {
                setVisibleCount(prev => Math.min(prev + pageSize, cameras.length));
            } else if (hasNextPage && !isFetchingNextPage) {
                loadTriggered.current = true;
                fetchNextPage().then(() => {
                    // Add a small delay before resetting the flag
                    setTimeout(() => {
                      loadTriggered.current = false;
                    }, 300); // delay in milliseconds; adjust as needed
                  });
            }
        }
    }, [inView, cameras, visibleCount, hasNextPage, isFetchingNextPage, isFetching, fetchNextPage])

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


    const debouncedHandleSearchQuery = useDebounce((value: string) => {
        mainStore.setSearchQuery(value, navigate);
    }, 600);

    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        debouncedHandleSearchQuery(event.currentTarget.value)
    }

    if (isLoading) return <CenteredCogwheelLoader />;
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
                    {cameras.slice(0, visibleCount).map(camera => (
                        <CameraCard key={camera.id} camera={camera} />
                    ))}
                </Grid>
                { isFetching && !isFetchingNextPage ? <CogwheelLoader /> : null}
                {/* trigger point. Rerender twice when enabled */}
                <div ref={ref} style={{ height: '50px' }} />
            </Flex>
        </Flex>
    );
}

export default observer(MainPage);
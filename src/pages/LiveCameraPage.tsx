import { Flex } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { frigateApi, frigateQueryKeys } from '../services/frigate.proxy/frigate.api';
import OverlayCogwheelLoader from '../shared/components/loaders/OverlayCogwheelLoader';
import Player from '../widgets/Player';
import CameraPageHeader from '../widgets/header/CameraPageHeader';
import RetryErrorPage from './RetryErrorPage';
import { LegacyRef, useRef } from 'react';
import CenteredCogwheelLoader from '../shared/components/loaders/CenteredCogwheelLoader';

const LiveCameraPage = () => {
    const { t } = useTranslation()
    const containerRef = useRef<HTMLDivElement | null>(null)
    let { id: cameraId } = useParams<'id'>()
    if (!cameraId) throw Error('Camera id does not exist')

    const { data: camera, isPending, isError, refetch } = useQuery({
        queryKey: [frigateQueryKeys.getCameraWHost, cameraId],
        queryFn: () => frigateApi.getCameraWHost(cameraId!)
    })

    if (isPending) return <CenteredCogwheelLoader />

    if (isError) return <RetryErrorPage onRetry={refetch} />


    return (
        <Flex ref={containerRef} w='100%' h='100%' justify='center' align='center' direction='column'>
            <CameraPageHeader camera={camera} editButton />
            <Player 
            camera={camera} 
            useWebGL={true}
            preferredLiveMode='jsmpeg'
            containerRef={containerRef}
            />
        </Flex>
    );
}

export default observer(LiveCameraPage)
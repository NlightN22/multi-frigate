import { Flex } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { useContext, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Context } from '..';
import { frigateApi, frigateQueryKeys } from '../services/frigate.proxy/frigate.api';
import CenterLoader from '../shared/components/loaders/CenterLoader';
import Player from '../widgets/Player';
import CameraPageHeader from '../widgets/header/CameraPageHeader';
import RetryErrorPage from './RetryErrorPage';

const LiveCameraPage = () => {
    const { t } = useTranslation()
    const executed = useRef(false)
    let { id: cameraId } = useParams<'id'>()
    if (!cameraId) throw Error('Camera id does not exist')

    const { data: camera, isPending, isError, refetch } = useQuery({
        queryKey: [frigateQueryKeys.getCameraWHost, cameraId],
        queryFn: () => frigateApi.getCameraWHost(cameraId!)
    })

    const { sideBarsStore } = useContext(Context)
    useEffect(() => {
        if (!executed.current) {
            sideBarsStore.rightVisible = false
            sideBarsStore.setLeftChildren(null)
            sideBarsStore.setRightChildren(null)
            executed.current = true
        }
    }, [sideBarsStore])


    if (isPending) return <CenterLoader />

    if (isError) return <RetryErrorPage onRetry={refetch} />


    return (
        <Flex w='100%' h='100%' justify='center' align='center' direction='column'>
            <CameraPageHeader camera={camera} editButton />
            <Player camera={camera} />
        </Flex>
    );
}

export default observer(LiveCameraPage)
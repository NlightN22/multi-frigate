import React, { useContext, useEffect } from 'react';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams } from 'react-router-dom';
import { frigateApi, frigateQueryKeys } from '../services/frigate.proxy/frigate.api';
import { useQuery } from '@tanstack/react-query';
import CenterLoader from '../shared/components/loaders/CenterLoader';
import RetryErrorPage from './RetryErrorPage';
import Player from '../widgets/Player';
import { Button, Flex, Text } from '@mantine/core';
import { strings } from '../shared/strings/strings';
import { routesPath } from '../router/routes.path';
import { recordingsPageQuery } from './RecordingsPage';

const LiveCameraPage = () => {
    const navigate = useNavigate()
    let { id: cameraId } = useParams<'id'>()
    if (!cameraId) throw Error('Camera id does not exist')

    const { data: camera, isPending, isError, refetch } = useQuery({
        queryKey: [frigateQueryKeys.getCameraWHost, cameraId],
        queryFn: () => frigateApi.getCameraWHost(cameraId!)
    })

    const { sideBarsStore } = useContext(Context)
    useEffect(() => {
        sideBarsStore.rightVisible = false
        sideBarsStore.setLeftChildren(null)
        sideBarsStore.setRightChildren(null)
    }, [])


    if (isPending) return <CenterLoader />

    if (isError) return <RetryErrorPage onRetry={refetch} />

    const handleOpenRecordings = () => {
        if (camera.frigateHost) {
            const url = `${routesPath.RECORDINGS_PATH}?${recordingsPageQuery.hostId}=${camera.frigateHost.id}&${recordingsPageQuery.cameraId}=${camera.id}`
            navigate(url)
        }
    }

    return (
        <Flex w='100%' h='100%' justify='center' align='center' direction='column'>
            <Flex w='100%' justify='center' align='baseline' mb='1rem'>
                <Text mr='1rem'>{strings.camera}: {camera.name} {camera.frigateHost ? `/ ${camera.frigateHost.name}` : ''}</Text>
                {!camera.frigateHost ? <></> :
                    <Button onClick={handleOpenRecordings}>{strings.recordings}</Button>
                }
            </Flex>
            <Player camera={camera} />
        </Flex>
    );
}

export default observer(LiveCameraPage)
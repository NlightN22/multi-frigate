import React, { Fragment, useContext, useEffect } from 'react';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { frigateApi, frigateQueryKeys } from '../services/frigate.proxy/frigate.api';
import { useQuery } from '@tanstack/react-query';
import CenterLoader from '../shared/components/CenterLoader';
import RetryError from './RetryError';
import Player from '../shared/components/frigate/Player';
import { Flex } from '@mantine/core';
import JSMpegPlayer from '../shared/components/frigate/JSMpegPlayer';

const LiveCameraPage = observer(() => {
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

    if (isError) return <RetryError onRetry={refetch} />

    // const hostNameWPort = camera.frigateHost ? new URL(camera.frigateHost.host).host : ''
    // const wsUrl = frigateApi.cameraWsURL(hostNameWPort, camera.name)

    return (
        <Flex w='100%' h='100%' justify='center'>
            <Player camera={camera} />
            {/* <JSMpegPlayer key={wsUrl} wsUrl={wsUrl}/> */}
            {/* {JSON.stringify(camera)} */}
            {/* {cameraWsURL} */}
        </Flex>
    );
})

export default LiveCameraPage;
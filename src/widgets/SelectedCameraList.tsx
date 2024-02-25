import { Center, Flex, Text } from '@mantine/core';
import React, { Suspense, useContext } from 'react';
import CameraAccordion from '../shared/components/accordion/CameraAccordion';
import { GetCameraWHostWConfig, GetFrigateHost } from '../services/frigate.proxy/frigate.schema';
import { useQuery } from '@tanstack/react-query';
import { Context } from '..';
import { frigateQueryKeys, frigateApi } from '../services/frigate.proxy/frigate.api';
import { host } from '../shared/env.const';
import CogwheelLoader from '../shared/components/loaders/CogwheelLoader';
import RetryErrorPage from '../pages/RetryErrorPage';
import CenterLoader from '../shared/components/CenterLoader';

interface SelectedCameraListProps {
    // cameraId: string,
}

const SelectedCameraList = ({
    // cameraId,
}: SelectedCameraListProps) => {

    const { recordingsStore: recStore } = useContext(Context)

    const { data: camera, isPending: cameraPending, isError: cameraError, refetch: cameraRefetch } = useQuery({
        queryKey: [frigateQueryKeys.getCameraWHost, recStore.selectedCamera?.id],
        queryFn: async () => {
            if (recStore.selectedCamera) {
                return frigateApi.getCameraWHost(recStore.selectedCamera.id)
            }
            return null
        }
    })

    const handleRetry = () => {
        cameraRefetch()
    }

    if (cameraPending) return <CenterLoader />
    if (cameraError) return <RetryErrorPage onRetry={handleRetry} />

    if (!camera?.frigateHost) return null

    return (
        <Flex w='100%' h='100%' direction='column' align='center'>
            <Text>{camera.frigateHost.name} / {camera.name}</Text>
            {
                

            }
            <Suspense>
                <CameraAccordion camera={camera} host={camera.frigateHost} />
            </Suspense>
        </Flex>
    )
};

export default SelectedCameraList;
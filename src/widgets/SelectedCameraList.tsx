import { Flex, Text } from '@mantine/core';
import React, { Suspense, useContext } from 'react';
import CameraAccordion from '../shared/components/accordion/CameraAccordion';
import { useQuery } from '@tanstack/react-query';
import { Context } from '..';
import { frigateQueryKeys, frigateApi } from '../services/frigate.proxy/frigate.api';
import RetryErrorPage from '../pages/RetryErrorPage';
import CenterLoader from '../shared/components/loaders/CenterLoader';
import { observer } from 'mobx-react-lite';

interface SelectedCameraListProps {
}

const SelectedCameraList = ({
}: SelectedCameraListProps) => {

    const { recordingsStore: recStore } = useContext(Context)

    const { data: camera, isPending: cameraPending, isError: cameraError, refetch: cameraRefetch } = useQuery({
        queryKey: [frigateQueryKeys.getCameraWHost, recStore.filteredCamera?.id],
        queryFn: async () => {
            if (recStore.filteredCamera) {
                return frigateApi.getCameraWHost(recStore.filteredCamera.id)
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
            <Suspense>
                <CameraAccordion />
            </Suspense>
        </Flex>
    )
};

export default observer(SelectedCameraList);
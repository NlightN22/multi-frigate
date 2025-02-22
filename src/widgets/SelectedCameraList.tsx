import { Flex, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { Suspense, useContext } from 'react';
import { Context } from '..';
import RetryErrorPage from '../pages/RetryErrorPage';
import { frigateApi, frigateQueryKeys } from '../services/frigate.proxy/frigate.api';
import CameraAccordion from '../shared/components/accordion/CameraAccordion';
import CenteredCogwheelLoader from '../shared/components/loaders/CenteredCogwheelLoader';


const SelectedCameraList = () => {

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

    if (cameraPending) return <CenteredCogwheelLoader />
    if (cameraError) return <RetryErrorPage onRetry={handleRetry} />

    if (!camera || !camera?.frigateHost) return null

    return (
        <Flex w='100%' h='100%' direction='column' align='center'>
            <Text>{camera.frigateHost.name} / {camera.name}</Text>
            <Suspense>
                <CameraAccordion camera={camera} />
            </Suspense>
        </Flex>
    )
};

export default observer(SelectedCameraList);
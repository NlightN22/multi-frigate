import { Accordion, Flex, Text } from '@mantine/core';
import React, { Suspense, lazy, useContext, useState } from 'react';
import { host } from '../shared/env.const';
import { useQuery } from '@tanstack/react-query';
import { frigateQueryKeys, frigateApi } from '../services/frigate.proxy/frigate.api';
import { Context } from '..';
import CenterLoader from '../shared/components/loaders/CenterLoader';
import RetryErrorPage from '../pages/RetryErrorPage';
import { strings } from '../shared/strings/strings';
import { observer } from 'mobx-react-lite';
const CameraAccordion = lazy(() => import('../shared/components/accordion/CameraAccordion'));


interface SelectedHostListProps {
    hostId: string
}

const SelectedHostList = ({
    hostId
}: SelectedHostListProps) => {

    const { recordingsStore: recStore } = useContext(Context)
    const [openCameraId, setOpenCameraId] = useState<string | null>(null)

    const { data: camerasQuery, isPending: hostPending, isError: hostError, refetch: hostRefetch } = useQuery({
        queryKey: [frigateQueryKeys.getCameraByHostId, hostId],
        queryFn: async () => {
            if (hostId) {
                return frigateApi.getCamerasByHostId(hostId)
            }
            return []
        }
    })

    const handleOnChange = (cameraId: string | null) => {
        setOpenCameraId(openCameraId === cameraId ? null : cameraId)
        recStore.openedCamera = camerasQuery?.find( camera => camera.id === cameraId)
    }

    const handleRetry = () => {
        if (recStore.filteredHost) hostRefetch()
    }

    if (hostPending) return <CenterLoader />
    if (hostError) return <RetryErrorPage onRetry={handleRetry} />

    if (!camerasQuery || camerasQuery.length < 1) return null

    const camerasItems = camerasQuery.map(camera => {
        return (
            <Accordion.Item key={camera.id + 'Item'} value={camera.id}>
                <Accordion.Control key={camera.id + 'Control'}>{strings.camera}: {camera.name}</Accordion.Control>
                <Accordion.Panel key={camera.id + 'Panel'}>
                    {openCameraId === camera.id && (
                        <Suspense>
                            <CameraAccordion />
                        </Suspense>
                    )}
                </Accordion.Panel>
            </Accordion.Item>
        )
    })

    return (
        <Flex w='100%' h='100%' direction='column' align='center'>
            <Text>{strings.host}: {camerasQuery[0].frigateHost?.name}</Text>
            <Accordion
                mt='1rem'
                variant='separated'
                radius="md" w='100%'
                onChange={(value) => handleOnChange(value)}>
                {camerasItems}
            </Accordion>
        </Flex>
    )
};

export default observer(SelectedHostList);
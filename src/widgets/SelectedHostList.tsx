import { Accordion, Flex, Text } from '@mantine/core';
import React, { Suspense, lazy, useContext, useState } from 'react';
import { host } from '../shared/env.const';
import { useQuery } from '@tanstack/react-query';
import { frigateQueryKeys, frigateApi } from '../services/frigate.proxy/frigate.api';
import { Context } from '..';
import CenterLoader from '../shared/components/CenterLoader';
import RetryError from '../pages/RetryError';
const CameraAccordion = lazy(() => import('../shared/components/accordion/CameraAccordion'));


interface SelectedHostListProps {
    hostId: string
}

const SelectedHostList = ({
    hostId
}: SelectedHostListProps) => {

    const { recordingsStore: recStore } = useContext(Context)
    const [openCameraId, setOpenCameraId] = useState<string | null>(null)

    const { data: host, isPending: hostPending, isError: hostError, refetch: hostRefetch } = useQuery({
        queryKey: [frigateQueryKeys.getFrigateHost, hostId],
        queryFn: async () => {
            if (hostId) {
                return frigateApi.getHost(hostId)
            }
            return null
        }
    })

    const handleOnChange = (cameraId: string | null) => {
        setOpenCameraId(openCameraId === cameraId ? null : cameraId)
    }

    const handleRetry = () => {
        if (recStore.selectedHost) hostRefetch()
    }

    if (hostPending) return <CenterLoader />
    if (hostError) return <RetryError onRetry={handleRetry} />

    if (!host || host.cameras.length < 1) return null

    const cameras = host.cameras.slice(0, 2).map(camera => {
        return (
            <Accordion.Item key={camera.id + 'Item'} value={camera.id}>
                <Accordion.Control key={camera.id + 'Control'}>{camera.name}</Accordion.Control>
                <Accordion.Panel key={camera.id + 'Panel'}>
                    {openCameraId === camera.id && (
                        <Suspense>
                            <CameraAccordion camera={camera} host={host} />
                        </Suspense>
                    )}
                </Accordion.Panel>
            </Accordion.Item>
        )
    })

    return (
        <Flex w='100%' h='100%' direction='column' align='center'>
            <Text>{host.name}</Text>
            <Accordion
                mt='1rem'
                variant='separated'
                radius="md" w='100%'
                onChange={(value) => handleOnChange(value)}>
                {cameras}
            </Accordion>
        </Flex>
    )
};

export default SelectedHostList;
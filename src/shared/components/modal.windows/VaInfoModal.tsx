import { ContextModalProps } from '@mantine/modals';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { frigateQueryKeys, proxyApi } from '../../../services/frigate.proxy/frigate.api';
import CogwheelLoader from '../loaders/CogwheelLoader';
import RetryError from '../RetryError';
import { Button, Center, Flex, Text } from '@mantine/core';

interface VaInfoModalProps {
    hostName?: string
}

export const VaInfoModal = ({
    context,
    id,
    innerProps
}: ContextModalProps<VaInfoModalProps>) => {
    const { hostName } = innerProps
    const { data, isError, isPending, refetch } = useQuery({
        queryKey: [frigateQueryKeys.getHostVaInfo, hostName],
        queryFn: () => {
            if (!hostName) return null
            return proxyApi.getHostVaInfo(hostName)
        }
    })

    if (isPending) return <CogwheelLoader />
    if (isError) return <RetryError onRetry={refetch} />
    if (!data) return <Text>Data is empty</Text>

    return (
        <Flex direction='column' w='100%'>
            <Text>Return code: {data.return_code}</Text>
            {data.stderr ? <Text>{data.stderr}</Text> : null}
            <Text>{data.stdout}</Text>
            <Center>
                <Button onClick={() => context.closeModal(id)}>Close</Button >
            </Center>
        </Flex>
    );
};

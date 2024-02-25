import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { frigateApi, frigateQueryKeys } from '../../services/frigate.proxy/frigate.api';
import CogwheelLoader from './loaders/CogwheelLoader';
import RetryError from './RetryError';
import { TransferList, Text, TransferListData, TransferListProps, TransferListItem, Button, Flex } from '@mantine/core';
import { OneSelectItem } from './filters.aps/OneSelectFilter';

interface CamerasTransferListProps {
    roleId: string
}

const CamerasTransferList = ({
    roleId,
}: CamerasTransferListProps) => {
    const queryClient = useQueryClient()
    const { data: cameras, isPending, isError, refetch } = useQuery({
        queryKey: [frigateQueryKeys.getCamerasWHost, roleId],
        queryFn: frigateApi.getCamerasWHost
    })

    const [lists, setLists] = useState<[TransferListItem[], TransferListItem[]]>([[], []])

    const handleChange = (value: TransferListData) => {
        setLists(value)
    }

    const mutation = useMutation({
        mutationFn: () => {
            const toRole = lists[1].map( item => item.value )
            return frigateApi.putRoleWCameras(roleId, toRole)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [frigateQueryKeys.getCamerasWHost] })
        },
    })

    useEffect(() => {
        if (cameras) {
            const roleInCameras: TransferListItem[] | undefined = cameras.filter(camera => camera.roles?.some(role => role.id === roleId))
                .map(camera => ({ value: camera.id, label: `${camera.name} / ${camera.frigateHost?.name}` }))
            const notInCameras: TransferListItem[] | undefined = cameras.filter(camera => !camera.roles?.some(role => role.id === roleId))
                .map(camera => ({ value: camera.id, label: `${camera.name} / ${camera.frigateHost?.name}` }))
            setLists([notInCameras, roleInCameras])
        }
    }, [cameras])


    if (isPending) return <CogwheelLoader />
    if (isError || !cameras) return <RetryError onRetry={refetch} />
    if (cameras.length < 1) return <Text>Empty cameras </Text>


    const handleSave = () => {
        mutation.mutate()
    }
    
    const handleDiscard = () => {
        refetch()
    }

    console.log('CamerasTransferListProps rendered')
    return (
        <>
            <Flex w='100%' justify='center'>
                <Button mt='1rem' w='10%' miw='6rem' mr='1rem' onClick={handleDiscard}>Discard</Button>
                <Button mt='1rem' w='10%' miw='5rem' onClick={handleSave}>Save</Button>
                </Flex>
            <TransferList
                transferAllMatchingFilter
                listHeight={500}
                mt='1rem'
                value={lists}
                onChange={handleChange}
                searchPlaceholder="Search..."
                nothingFound="Nothing here"
                titles={['Not allowed', 'Allowed']}
                breakpoint="sm"
            />
        </>
    );
};

export default CamerasTransferList;
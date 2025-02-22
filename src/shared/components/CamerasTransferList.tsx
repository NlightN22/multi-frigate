import { Button, Flex, Text, TransferList, TransferListData, TransferListItem } from '@mantine/core';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { frigateApi, frigateQueryKeys } from '../../services/frigate.proxy/frigate.api';
import { isProduction } from '../env.const';
import RetryError from './RetryError';
import CenteredCogwheelLoader from './loaders/CenteredCogwheelLoader';

interface CamerasTransferListProps {
    roleId: string
}

const CamerasTransferList = ({
    roleId,
}: CamerasTransferListProps) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    const { data: cameras, isPending, isError, refetch } = useQuery({
        queryKey: [frigateQueryKeys.getCamerasWHost],
        queryFn: () => frigateApi.getCamerasWHost()
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


    if (isPending) return <CenteredCogwheelLoader />
    if (isError || !cameras) return <RetryError onRetry={refetch} />
    if (cameras.length < 1) return <Text> {t('camersDoesNotExist')}</Text>


    const handleSave = () => {
        mutation.mutate()
    }
    
    const handleDiscard = () => {
        refetch()
    }

    if (!isProduction) console.log('CamerasTransferListProps rendered')
    return (
        <>
            <Flex w='100%' justify='center'>
                <Button mt='1rem' miw='6rem' mr='1rem' onClick={handleDiscard}>{t('discard')}</Button>
                <Button mt='1rem' miw='5rem' onClick={handleSave}>{t('save')}</Button>
                </Flex>
            <TransferList
                transferAllMatchingFilter
                listHeight={500}
                mt='1rem'
                value={lists}
                onChange={handleChange}
                searchPlaceholder={t('search')}
                nothingFound={t('nothingHere')}
                titles={[t('notAllowed'), t('allowed')]}
                breakpoint="sm"
            />
        </>
    );
};

export default CamerasTransferList;
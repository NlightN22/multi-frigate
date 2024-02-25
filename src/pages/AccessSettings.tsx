import { useQuery } from '@tanstack/react-query';
import React, { useContext, useEffect, useState } from 'react';
import { frigateApi, frigateQueryKeys } from '../services/frigate.proxy/frigate.api';
import CenterLoader from '../shared/components/CenterLoader';
import RetryErrorPage from './RetryErrorPage';
import { Flex, Group, Select, Text } from '@mantine/core';
import OneSelectFilter, { OneSelectItem } from '../shared/components/filters.aps/OneSelectFilter';
import { useMediaQuery } from '@mantine/hooks';
import { dimensions } from '../shared/dimensions/dimensions';
import CamerasTransferList from '../shared/components/CamerasTransferList';
import { Context } from '..';

const AccessSettings = () => {
    const { data, isPending, isError, refetch } = useQuery({
        queryKey: [frigateQueryKeys.getRoles],
        queryFn: frigateApi.getRoles
    })
    const { sideBarsStore } = useContext(Context)


    useEffect(() => {
        sideBarsStore.rightVisible = false
        sideBarsStore.setLeftChildren(null)
        sideBarsStore.setRightChildren(null)
    }, [])

    const isMobile = useMediaQuery(dimensions.mobileSize)
    const [roleId, setRoleId] = useState<string>()


    if (isPending) return <CenterLoader />
    if (isError || !data) return <RetryErrorPage />
    const rolesSelect: OneSelectItem[] = data.map(role => ({ value: role.id, label: role.name }))

    const handleSelectRole = (value: string) => {
        setRoleId(value)
    }

    console.log('AccessSettings rendered')
    return (
        <Flex w='100%' h='100%' direction='column'>
            <Text align='center' size='xl'>Please select role</Text>
            <Flex justify='space-between' align='center' w='100%'>
                {!isMobile ? <Group w='40%' /> : <></>}
                <Select
                    w='100%'
                    mt='1rem'
                    data={rolesSelect}
                    value={roleId}
                    onChange={handleSelectRole}
                    searchable
                    clearable
                />
                {!isMobile ? <Group w='40%' /> : <></>}
            </Flex>
            {!roleId ? <></> :
                <CamerasTransferList roleId={roleId} />
            }
        </Flex>
    );
};

export default AccessSettings;
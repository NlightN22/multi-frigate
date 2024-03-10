import { Flex, Group, Select, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Context } from '..';
import { useAdminRole } from '../hooks/useAdminRole';
import { frigateApi, frigateQueryKeys } from '../services/frigate.proxy/frigate.api';
import CamerasTransferList from '../shared/components/CamerasTransferList';
import { OneSelectItem } from '../shared/components/filters/OneSelectFilter';
import CenterLoader from '../shared/components/loaders/CenterLoader';
import { dimensions } from '../shared/dimensions/dimensions';
import { isProduction } from '../shared/env.const';
import Forbidden from './403';
import RetryErrorPage from './RetryErrorPage';

const AccessSettings = () => {
    const { t } = useTranslation()
    const executed = useRef(false)
    const { data, isPending, isError, refetch } = useQuery({
        queryKey: [frigateQueryKeys.getRoles],
        queryFn: frigateApi.getRoles
    })
    const { sideBarsStore } = useContext(Context)
    const { isAdmin, isLoading: adminLoading } = useAdminRole()

    useEffect(() => {
        if (!executed.current) {
            sideBarsStore.rightVisible = false
            sideBarsStore.setLeftChildren(null)
            sideBarsStore.setRightChildren(null)
            executed.current = true
        }
    }, [sideBarsStore])

    const isMobile = useMediaQuery(dimensions.mobileSize)
    const [roleId, setRoleId] = useState<string>()


    if (isPending || adminLoading) return <CenterLoader />
    if (isError || !data) return <RetryErrorPage onRetry={refetch} />
    if (!isAdmin) return <Forbidden />
    const rolesSelect: OneSelectItem[] = data.map(role => ({ value: role.id, label: role.name }))

    const handleSelectRole = (value: string) => {
        setRoleId(value)
    }

    if (!isProduction) console.log('AccessSettings rendered')
    return (
        <Flex w='100%' h='100%' direction='column'>
            <Text align='center' size='xl'>{t('pleaseSelectRole')}</Text>
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

export default observer(AccessSettings);
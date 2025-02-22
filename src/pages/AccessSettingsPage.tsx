import { Flex, Group, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAdminRole } from '../hooks/useAdminRole';
import { frigateApi, frigateQueryKeys } from '../services/frigate.proxy/frigate.api';
import CamerasTransferList from '../shared/components/CamerasTransferList';
import RoleSelectFilter from '../shared/components/filters/RoleSelectFilter';
import OverlayCogwheelLoader from '../shared/components/loaders/OverlayCogwheelLoader';
import { dimensions } from '../shared/dimensions/dimensions';
import { isProduction } from '../shared/env.const';
import Forbidden from './403';
import RetryErrorPage from './RetryErrorPage';

const AccessSettings = () => {
    const { t } = useTranslation()
    const { data, isPending, isError, refetch } = useQuery({
        queryKey: [frigateQueryKeys.getRoles],
        queryFn: frigateApi.getRoles
    })
    const { isAdmin, isLoading: adminLoading, isError: adminError } = useAdminRole()



    const isMobile = useMediaQuery(dimensions.mobileSize)
    const [roleId, setRoleId] = useState<string>()


    if (isPending || adminLoading) return <OverlayCogwheelLoader />
    if (isError || adminError || !data) return <RetryErrorPage onRetry={refetch} />
    if (!isAdmin) return <Forbidden />

    const handleSelectRole = (value: string) => {
        setRoleId(value)
    }

    if (!isProduction) console.log('AccessSettings rendered')
    return (
        <Flex w='100%' h='100%' direction='column'>
            <Text align='center' size='xl'>{t('pleaseSelectRole')}</Text>
            <Flex justify='space-between' align='center' w='100%'>
                {!isMobile ? <Group w='40%' /> : <></>}
                <RoleSelectFilter
                    w='100%'
                    mt='1rem'
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
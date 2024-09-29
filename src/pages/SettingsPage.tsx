import { Flex, Space } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useMutation } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAdminRole } from '../hooks/useAdminRole';
import { frigateApi, frigateQueryKeys } from '../services/frigate.proxy/frigate.api';
import { GetRole } from '../services/frigate.proxy/frigate.schema';
import CenterLoader from '../shared/components/loaders/CenterLoader';
import { dimensions } from '../shared/dimensions/dimensions';
import OIDPSettingsForm from '../widgets/OIDPSettingsForm';
import RolesSettingsForm from '../widgets/RolesSettingsForm';
import Forbidden from './403';

const SettingsPage = () => {
    const { t } = useTranslation()

    const [showRoles, setShowRoles] = useState<boolean>(false)
    const [allRoles, setAllRoles] = useState<GetRole[]>()

    const { isAdmin, isLoading: adminLoading } = useAdminRole()

    const isMobile = useMediaQuery(dimensions.mobileSize)

    const getRoles = useMutation({
        mutationKey: [frigateQueryKeys.getRoles],
        mutationFn: frigateApi.getRoles,
        onSuccess: (data) => {
            setAllRoles(data)
        }
    })

    const handleOIDPConfigValid = (valid: boolean) => {
        setShowRoles(valid)
        getRoles.mutate()
    }

    if (!isAdmin) return <Forbidden />
    if (adminLoading) return <CenterLoader />

    return (
        <Flex h='100%'>
            {!isMobile ?
                < Space w='20%' />
                : null
            }
            <Flex direction='column' h='100%' w='100%' justify='stretch'>
                <OIDPSettingsForm isConfigValid={handleOIDPConfigValid} />
                {
                    showRoles && allRoles ?
                        <RolesSettingsForm
                            allRoles={allRoles}
                            refetchRoles={() => getRoles.mutate()}
                        />
                        : null
                }
            </Flex>
            {!isMobile ?
                <Space w='20%' />
                : null
            }
        </Flex>
    );
};

export default observer(SettingsPage);
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { frigateApi, frigateQueryKeys } from '../services/frigate.proxy/frigate.api';
import RetryError from '../shared/components/RetryError';
import RoleSelectFilter from '../shared/components/filters/RoleSelectFilter';
import CogwheelLoader from '../shared/components/loaders/CogwheelLoader';
import { GetRole } from '../services/frigate.proxy/frigate.schema';
import { isProduction } from '../shared/env.const';
import { Flex, Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCircleCheck, IconAlertCircle } from '@tabler/icons-react';
import { v4 } from 'uuid';

interface Roles {
    adminRole?: {
        id?: string,
        name?: string,
    },
    birdsEyeRole?: {
        id?: string,
        name?: string,
    }
}

interface RolesSettingsFormProps {
    allRoles: GetRole[]
}

const RolesSettingsForm: React.FC<RolesSettingsFormProps> = ({
    allRoles
}) => {
    const [roles, setRoles] = useState<Roles>()
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    const adminRoleKey = 'adminRole'
    const birdsEyeRoleKey = 'birdsEyeRole'

    const { isPending, isError, data, refetch } = useQuery({
        queryKey: [frigateQueryKeys.getConfig, adminRoleKey, birdsEyeRoleKey],
        queryFn: async () => {

            const adminConfig = await frigateApi.getConfig(adminRoleKey)
            const birdsEyeRoleConfig = await frigateApi.getConfig(birdsEyeRoleKey)
            return {
                adminRole: {
                    id: allRoles.find(role => role.name === adminConfig.value)?.id,
                    name: allRoles.find(role => role.name === adminConfig.value)?.name
                },
                birdsEyeRole: {
                    id: allRoles.find(role => role.name === birdsEyeRoleConfig.value)?.id,
                    name: allRoles.find(role => role.name === birdsEyeRoleConfig.value)?.name
                },
            }
        },
    })

    const save = useMutation({
        mutationFn: async () => {
            if (roles?.adminRole?.name) {
                const adminConfig = {
                    value: roles.adminRole.name,
                    key: adminRoleKey
                }
                const birdsEyeConfig = {
                    value: roles.birdsEyeRole?.name ? roles.birdsEyeRole.name : '',
                    key: birdsEyeRoleKey
                }
                frigateApi.putConfigs([adminConfig, birdsEyeConfig]).catch(error => {
                    if (error.response && error.response.data) {
                        return Promise.reject(error.response.data)
                    }
                    return Promise.reject(error)
                })
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [frigateQueryKeys.getConfig, adminRoleKey, birdsEyeRoleKey] })
            notifications.show({
                id: v4(),
                withCloseButton: true,
                autoClose: 5000,
                title: t('successfully'),
                message: t('successfullySaved'),
                color: 'green',
                icon: <IconCircleCheck />
            })
        },
        onError: (e) => {
            notifications.show({
                id: e.message,
                withCloseButton: true,
                autoClose: false,
                title: t('error'),
                message: e.message,
                color: 'red',
                icon: <IconAlertCircle />,
            })
        }
    })

    useEffect(() => {
        setRoles(data)
    }, [data])

    const handleSelectAdmin = (roleId: string) => {
        const role = allRoles.find(role => role.id === roleId)
        setRoles({
            ...roles,
            adminRole: {
                id: role?.id,
                name: role?.name
            },
        })
    }

    const handleSelectBirdsEye = (roleId: string) => {
        const role = allRoles.find(role => role.id === roleId)
        setRoles({
            ...roles,
            birdsEyeRole: {
                id: role?.id,
                name: role?.name
            },
        })
    }

    const handleDiscard = () => {
        refetch()
        if (data) setRoles(data)
    }

    const handleSave = () => {
        save.mutate()
    }

    useEffect(() => {
        if (!isProduction) console.log('Roles:', roles)
    }, [roles])

    if (isPending) return <CogwheelLoader />
    if (isError) return <RetryError onRetry={refetch} />

    return (
        <>
            <RoleSelectFilter
                label={t('settingsPage.adminRole')}
                mt='lg'
                searchable
                error={!roles?.adminRole?.id ? "Pick at least one item" : undefined}
                value={roles?.adminRole?.id ? roles.adminRole.id : null}
                onChange={handleSelectAdmin}
            />
            <RoleSelectFilter
                label={t('settingsPage.birdseyeRole')}
                mt='md'
                searchable
                value={roles?.birdsEyeRole?.id ? roles.birdsEyeRole.id : null}
                onChange={handleSelectBirdsEye}
                clearable
            />
            <Flex w='100%' justify='stretch' wrap='nowrap' align='center' mt='lg'>
                <Button w='100%' onClick={handleDiscard} m='0.5rem'>{t('discard')}</Button>
                <Button w='100%' onClick={handleSave} m='0.5rem'>{t('confirm')}</Button>
            </Flex>
        </>
    );
};

export default RolesSettingsForm;
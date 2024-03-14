import { Button, Flex, Space } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Context } from '..';
import { useAdminRole } from '../hooks/useAdminRole';
import { frigateApi, frigateQueryKeys } from '../services/frigate.proxy/frigate.api';
import { GetConfig, PutConfig } from '../services/frigate.proxy/frigate.schema';
import { FloatingLabelInput } from '../shared/components/inputs/FloatingLabelInput';
import CenterLoader from '../shared/components/loaders/CenterLoader';
import { dimensions } from '../shared/dimensions/dimensions';
import { isProduction } from '../shared/env.const';
import Forbidden from './403';
import RetryErrorPage from './RetryErrorPage';
import { notifications } from '@mantine/notifications';
import { v4 } from 'uuid';
import { IconAlertCircle, IconCircleCheck } from '@tabler/icons-react';

const SettingsPage = () => {
    const { t } = useTranslation()
    const executed = useRef(false)
    const queryClient = useQueryClient()
    const { isPending: configPending, error: configError, data, refetch } = useQuery({
        queryKey: [frigateQueryKeys.getConfig],
        queryFn: frigateApi.getConfig,
    })

    const { sideBarsStore } = useContext(Context)
    useEffect(() => {
        if (!executed.current) {
            sideBarsStore.rightVisible = false
            sideBarsStore.setLeftChildren(null)
            sideBarsStore.setRightChildren(null)
            executed.current = true
        }
    }, [sideBarsStore])

    const { isAdmin, isLoading: adminLoading } = useAdminRole()


    const ecryptedTemplate = 'encrypted value is exist'
    const mapEncryptedToView = (data: GetConfig[] | undefined): GetConfig[] | undefined => {
        return data?.map(item => {
            const { value, encrypted, ...rest } = item
            if (encrypted && value) return { value: ecryptedTemplate, encrypted, ...rest }
            return item
        })
    }

    const [configs, setConfigs] = useState(data)
    const isMobile = useMediaQuery(dimensions.mobileSize)

    const mutation = useMutation({
        mutationFn: (config: PutConfig[]) => frigateApi.putConfig(config).catch(error => {
            if (error.response && error.response.data) {
                return Promise.reject(error.response.data)
            }
            return Promise.reject(error)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [frigateQueryKeys.getConfig] })
            notifications.show({
                id: v4(),
                withCloseButton: true,
                autoClose: 5000,
                title: `Sucessfully`,
                message: `Sucessfully saved`,
                color: 'green',
                icon: <IconCircleCheck />
              })
        },
        onError: (e) => {
            notifications.show({
                id: e.message,
                withCloseButton: true,
                autoClose: false,
                title: "Error",
                message: e.message,
                color: 'red',
                icon: <IconAlertCircle />,
            })
        }
    })

    const handleDiscard = () => {
        if (!isProduction) console.log('Discard changes')
        refetch()
        setConfigs(data ? mapEncryptedToView(data) : [])
    }
    useEffect(() => {
        if (!isProduction) console.log('data changed')
        setConfigs(mapEncryptedToView(data))
    }, [data])

    useEffect(() => {
        if (!isProduction) console.log('configs changed')
    }, [configs])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget);
        const formDataObj: any = Array.from(formData.entries()).reduce((acc, [key, value]) => ({
            ...acc,
            [key]: value,
        }), {});

        const configsToUpdate = Object.keys(formDataObj).map(key => {
            const value = formDataObj[key]
            const currData = data?.find(val => val.key === key)
            const notChangedEncrypted = value === ecryptedTemplate
            if (currData && currData.encrypted && notChangedEncrypted) {
                return {
                    key,
                    value: currData.value
                }
            }
            return {
                key,
                value: value,
            }
        });
        if (!isProduction) console.log('configsToUpdate', configsToUpdate)
        mutation.mutate(configsToUpdate);
    }

    if (!isAdmin) return <Forbidden />
    if (configPending || adminLoading) return <CenterLoader />
    if (configError) return <RetryErrorPage onRetry={refetch} />

    return (
        <Flex h='100%'>
            {!isMobile ?
                < Space w='20%' />
                : <></>
            }
            <Flex direction='column' h='100%' w='100%' justify='stretch'>
                <form onSubmit={handleSubmit}>
                    {!configs ? <></>
                        :
                        configs.map((config) => (
                            <FloatingLabelInput
                                key={`${config.key}-${new Date().getTime()}`}
                                name={config.key}
                                label={config.description}
                                value={config.value}
                                placeholder={config.description}
                                encrypted={config.encrypted}
                                ecryptedValue={ecryptedTemplate}
                            />
                        ))}
                    <Space h='2%' />
                    <Flex w='100%' justify='stretch' wrap='nowrap' align='center'>
                        <Button w='100%' onClick={handleDiscard} m='0.5rem'>{t('discard')}</Button>
                        <Button w='100%' type="submit" m='0.5rem'>{t('confirm')}</Button>
                    </Flex>
                </form>
            </Flex>
            {!isMobile ?
                <Space w='20%' />
                : <></>
            }
        </Flex>
    );
};

export default observer(SettingsPage);
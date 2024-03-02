import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    useQuery,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query'
import { frigateApi, frigateQueryKeys } from '../services/frigate.proxy/frigate.api';
import CenterLoader from '../shared/components/loaders/CenterLoader';
import RetryErrorPage from './RetryErrorPage';
import { Button, Flex, Space } from '@mantine/core';
import { FloatingLabelInput } from '../shared/components/inputs/FloatingLabelInput';
import { strings } from '../shared/strings/strings';
import { dimensions } from '../shared/dimensions/dimensions';
import { useMediaQuery } from '@mantine/hooks';
import { GetConfig } from '../services/frigate.proxy/frigate.schema';
import { Context } from '..';
import { useAdminRole } from '../hooks/useAdminRole';
import Forbidden from './403';
import { observer } from 'mobx-react-lite';
import { isProduction } from '../shared/env.const';

const SettingsPage = () => {
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


    const ecryptedTemplate = '**********'
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
        mutationFn: frigateApi.putConfig,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [frigateQueryKeys.getConfig] })
        },
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

    if (configPending || adminLoading) return <CenterLoader />
    if (configError) return <RetryErrorPage onRetry={refetch} />
    if (!isAdmin) return <Forbidden />

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
                                ecryptedValue={ecryptedTemplate}
                            />
                        ))}
                    <Space h='2%' />
                    <Flex w='100%' justify='stretch' wrap='nowrap' align='center'>
                        <Button w='100%' onClick={handleDiscard} m='0.5rem'>{strings.discard}</Button>
                        <Button w='100%' type="submit" m='0.5rem'>{strings.confirm}</Button>
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
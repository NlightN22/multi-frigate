import React, { useEffect, useState } from 'react';
import {
    useQuery,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query'
import { Config, frigateApi } from '../services/frigate.proxy/frigate.api';
import CenterLoader from '../shared/components/CenterLoader';
import RetryError from './RetryError';
import { Button, Flex, Space } from '@mantine/core';
import { FloatingLabelInput } from '../shared/components/FloatingLabelInput';
import { strings } from '../shared/strings/strings';
import { dimensions } from '../shared/dimensions/dimensions';
import { useMediaQuery } from '@mantine/hooks';

const SettingsPage = () => {
    const queryClient = useQueryClient()
    const { isPending: configPending, error: configError, data, refetch } = useQuery({
        queryKey: ['config'],
        queryFn: frigateApi.getConfig,
    })

    const ecryptedValue = '**********'
    const mapEncryptedToView = (data: Config[] | undefined): Config[] | undefined => {
        return data?.map(item => {
            const { value, encrypted, ...rest } = item
            if (encrypted) return { value: ecryptedValue, encrypted, ...rest }
            return item
        })
    }

    const [configs, setConfigs] = useState(data)
    const isMobile = useMediaQuery(dimensions.mobileSize)

    const mutation = useMutation({
        mutationFn: frigateApi.putConfig,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['config'] })
        },
    })

    const handleDiscard = () => {
        console.log('Discard changes')
        refetch()
        setConfigs(data ? mapEncryptedToView(data) : [])
    }
    useEffect(() => {
        console.log('data changed')
        setConfigs(mapEncryptedToView(data))
    }, [data])

    useEffect(() => {
        console.log('configs changed')
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
            const currData = data?.find( val => val.key === key)
            const isEncrypted = value === ecryptedValue
            if (currData && currData.encrypted && isEncrypted) {
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
        console.log('configsToUpdate', configsToUpdate)
        mutation.mutate(configsToUpdate);
    }

    if (configPending) return <CenterLoader />

    if (configError) return <RetryError />

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
                                ecryptedValue={ecryptedValue}
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

export default SettingsPage;
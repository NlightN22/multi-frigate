import { Center, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect } from 'react';
import { Context } from '../../..';
import { frigateQueryKeys, frigateApi } from '../../../services/frigate.proxy/frigate.api';
import { strings } from '../../strings/strings';
import CogwheelLoader from '../loaders/CogwheelLoader';
import OneSelectFilter, { OneSelectItem } from './OneSelectFilter';
import RetryError from '../RetryError';

const HostSelectFilter = () => {
    const { recordingsStore: recStore } = useContext(Context)

    const { data: hosts, isError, isPending, isSuccess, refetch } = useQuery({
        queryKey: [frigateQueryKeys.getFrigateHosts],
        queryFn: frigateApi.getHosts
    })

    useEffect(() => {
        if (!hosts) return
        if (recStore.hostIdParam) {
            recStore.selectedHost = hosts.find(host => host.id === recStore.hostIdParam)
            recStore.hostIdParam = undefined
        }
    }, [isSuccess])

    if (isPending) return <CogwheelLoader />
    if (isError) return <RetryError onRetry={refetch}/>

    if (!hosts || hosts.length < 1) return null

    const hostItems: OneSelectItem[] = hosts
        .filter(host => host.enabled)
        .map(host => ({ value: host.id, label: host.name }))

    const handleSelect = (value: string) => {
        const host = hosts?.find(host => host.id === value)
        if (!host) {
            recStore.selectedHost = undefined
            recStore.selectedCamera = undefined
            return
        }
        if (recStore.selectedHost?.id !== host.id) {
            recStore.selectedCamera = undefined
        }
        recStore.selectedHost = host
    }

    return (
        <OneSelectFilter
            id='frigate-hosts'
            label={strings.selectHost}
            spaceBetween='1rem'
            value={recStore.selectedHost?.id || ''}
            defaultValue={recStore.selectedHost?.id || ''}
            data={hostItems}
            onChange={handleSelect}
        />
    );
};

export default observer(HostSelectFilter);
import React, { useContext, useEffect } from 'react';
import OneSelectFilter, { OneSelectItem } from '../shared/components/filters.aps/OneSelectFilter';
import { observer } from 'mobx-react-lite';
import { Context } from '..';
import { useQuery } from '@tanstack/react-query';
import { frigateApi, frigateQueryKeys } from '../services/frigate.proxy/frigate.api';
import { Center, Text } from '@mantine/core';
import CogwheelLoader from '../shared/components/CogwheelLoader';
import CameraSelectFilter from '../shared/components/filters.aps/CameraSelectFilter';

interface RecordingsFiltersRightSideProps {
}

const RecordingsFiltersRightSide = ({
}: RecordingsFiltersRightSideProps) => {
    const { recordingsStore: recStore } = useContext(Context)

    const { data: hosts, isError, isPending, isSuccess } = useQuery({
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
    if (isError) return <Center><Text>Loading error!</Text></Center>

    if (!hosts || hosts.length < 1) return null

    const hostItems: OneSelectItem[] = hosts
        .filter(host => host.enabled)
        .map(host => ({ value: host.id, label: host.name }))

    const handleSelect = (id: string, value: string) => {
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

    console.log('RecordingsFiltersRightSide rendered')
    return (
        <>
            <OneSelectFilter
                id='frigate-hosts'
                label='Select host:'
                spaceBetween='1rem'
                value={recStore.selectedHost?.id || ''}
                defaultValue={recStore.selectedHost?.id  || ''}
                data={hostItems}
                onChange={handleSelect}
            />
            {recStore.selectedHost ?
                <CameraSelectFilter 
                selectedHostId={recStore.selectedHost.id} />
                :
                <></>
            }
        </>

    )
}

export default observer(RecordingsFiltersRightSide);
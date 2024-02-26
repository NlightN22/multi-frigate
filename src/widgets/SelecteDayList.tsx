import { useQuery } from '@tanstack/react-query';
import React, { useContext } from 'react';
import { frigateQueryKeys, mapHostToHostname, proxyApi } from '../services/frigate.proxy/frigate.api';
import { dateToQueryString, getResolvedTimeZone } from '../shared/utils/dateUtil';
import { Context } from '..';
import { Flex, Text } from '@mantine/core';
import RetryErrorPage from '../pages/RetryErrorPage';
import CenterLoader from '../shared/components/loaders/CenterLoader';
import { observer } from 'mobx-react-lite';
import DayAccordion from '../shared/components/accordion/DayAccordion';

interface SelecteDayListProps {
    day: Date

}

const SelecteDayList = ({
    day
}: SelecteDayListProps) => {
    const { recordingsStore: recStore } = useContext(Context)
    const camera = recStore.filteredCamera
    const host = recStore.filteredHost

    const { data, isPending, isError, refetch } = useQuery({
        queryKey: [frigateQueryKeys.getRecordingsSummary, recStore.filteredCamera?.id, day],
        queryFn: async () => {
            if (camera && host) {
                const stringDay = dateToQueryString(day)
                const hostName = mapHostToHostname(host)
                const res = await proxyApi.getRecordingsSummary(hostName, camera.name, getResolvedTimeZone())
                return res.find(record => record.day === stringDay)
            }
            return null
        }
    })

    const handleRetry = () => {
        if (recStore.filteredHost) refetch()
    }

    if (isPending) return <CenterLoader />
    if (isError) return <RetryErrorPage onRetry={handleRetry} />
    if (!camera || !host || !data) return <CenterLoader />

    return (
        <Flex w='100%' h='100%' direction='column' align='center'>
            <Text>{host.name} / {camera.name} / {data.day}</Text>
            <DayAccordion recordSummary={data} />
        </Flex>
    );
};

export default observer(SelecteDayList);
import { Center, Flex, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Context } from '..';
import RetryErrorPage from '../pages/RetryErrorPage';
import { frigateQueryKeys, mapHostToHostname, proxyApi } from '../services/frigate.proxy/frigate.api';
import DayAccordion from '../shared/components/accordion/DayAccordion';
import CenteredCogwheelLoader from '../shared/components/loaders/CenteredCogwheelLoader';
import { isProduction } from '../shared/env.const';
import { dateToQueryString, getResolvedTimeZone } from '../shared/utils/dateUtil';

interface SelectedDayListProps {
    day: Date
}

const SelectedDayList = ({
    day
}: SelectedDayListProps) => {
    const { recordingsStore: recStore } = useContext(Context)
    const camera = recStore.filteredCamera
    const host = recStore.filteredHost

    const { t } = useTranslation()


    const [retryCount, setRetryCount] = useState(0)
    const MAX_RETRY_COUNT = 3

    const { data, isPending, isError, refetch } = useQuery({
        queryKey: [frigateQueryKeys.getRecordingsSummary, recStore.filteredCamera?.id, day],
        queryFn: async ({signal}) => {
            if (camera && host) {
                const hostName = mapHostToHostname(host)
                if (hostName) {
                    return proxyApi.getRecordingsSummary(hostName, camera.name, getResolvedTimeZone(), signal)
                }
            }
            return null
        },
        retry: (failureCount, error) => {
            setRetryCount(failureCount);

            if (failureCount >= MAX_RETRY_COUNT) return false;

            return true;
        }
    })

    const handleRetry = () => {
        if (recStore.filteredHost) refetch()
    }

    if (isPending) return <CenteredCogwheelLoader />

    if (isError && retryCount >= MAX_RETRY_COUNT) {
        return (
            <Center>
                <Text>{t('maxRetries', { maxRetries: MAX_RETRY_COUNT })}</Text>
            </Center>
        );
    }

    if (isError) return <RetryErrorPage onRetry={handleRetry} />
    if (!camera || !host) return <Center><Text>Please select host or camera</Text></Center>
    if (!data) return <Text>Not have response from server</Text>

    const stringDay = dateToQueryString(day)
    const recordingsDay = data.find(record => record.day === stringDay)
    if (!recordingsDay) return <Center><Text>Not have record at {stringDay}</Text></Center>

    if (!isProduction) console.log('SelectedDayList rendered')
    return (
        <Flex w='100%' h='100%' direction='column' align='center'>
            <Text>{host.name} / {camera.name} / {stringDay}</Text>
            <DayAccordion
                host={host}
                camera={camera}
                recordSummary={recordingsDay} />
        </Flex>
    )
}

export default observer(SelectedDayList)
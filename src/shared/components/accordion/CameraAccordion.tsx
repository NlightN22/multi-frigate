import { Accordion, Center, Loader } from '@mantine/core';
import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { frigateQueryKeys, mapHostToHostname, proxyApi } from '../../../services/frigate.proxy/frigate.api';
import DayAccordion from './DayAccordion';
import { observer } from 'mobx-react-lite';
import { Context } from '../../..';
import { getResolvedTimeZone, parseQueryDateToDate } from '../../utils/dateUtil';
import RetryError from '../RetryError';
import { strings } from '../../strings/strings';
import { RecordSummary } from '../../../types/record';
import { isProduction } from '../../env.const';

const CameraAccordion = () => {
    const { recordingsStore: recStore } = useContext(Context)

    const camera = recStore.openedCamera || recStore.filteredCamera
    const host = recStore.filteredHost
    const hostName = mapHostToHostname(host)

    const { data, isPending, isError, refetch } = useQuery({
        queryKey: [frigateQueryKeys.getRecordingsSummary, camera?.id],
        queryFn: () => {
            if (camera && hostName) {
                return proxyApi.getRecordingsSummary(hostName, camera.name, getResolvedTimeZone())
            }
            return null
        }
    })

    if (isPending) return <Center><Loader /></Center>
    if (isError) return <RetryError onRetry={refetch} />

    if (!data || !camera) return null

    const recodItem = (record: RecordSummary) => (
        <Accordion.Item key={record.day} value={record.day}>
            <Accordion.Control key={record.day + 'control'}>{strings.day}: {record.day}</Accordion.Control>
            <Accordion.Panel key={record.day + 'panel'}>
                <DayAccordion key={record.day + 'day'} recordSummary={record} />
            </Accordion.Panel>
        </Accordion.Item>
    )

    const days = () => {
        const [startDate, endDate] = recStore.selectedRange
        if (startDate && endDate) {
            return data
                .filter(rec => {
                    const parsedRecDate = parseQueryDateToDate(rec.day)
                    if (parsedRecDate) {
                        return parsedRecDate >= startDate && parsedRecDate <= endDate
                    }
                    return false
                })
                .map(rec => recodItem(rec))
        }
        if ((startDate && endDate) || (!startDate && !endDate)) {
            return data.map(rec => recodItem(rec))
        }
        return []
    }

    if (!isProduction) console.log('CameraAccordion rendered')

    return (
        <Accordion variant='separated' radius="md" w='100%'>
            {days()}
        </Accordion>
    )
}

export default observer(CameraAccordion);
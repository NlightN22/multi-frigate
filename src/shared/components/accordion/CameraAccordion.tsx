import { Accordion, Center, Loader, Text } from '@mantine/core';
import React, { useContext, useEffect, useState } from 'react';
import { GetCameraWHostWConfig, GetFrigateHost } from '../../../services/frigate.proxy/frigate.schema';
import { useQuery } from '@tanstack/react-query';
import { frigateQueryKeys, mapHostToHostname, proxyApi } from '../../../services/frigate.proxy/frigate.api';
import DayAccordion from './DayAccordion';
import { observer } from 'mobx-react-lite';
import { Context } from '../../..';
import { getResolvedTimeZone, parseQueryDateToDate } from '../../utils/dateUtil';
import RetryError from '../RetryError';
import { strings } from '../../strings/strings';
import { RecordSummary } from '../../../types/record';

interface CameraAccordionProps {
    camera: GetCameraWHostWConfig,
    host: GetFrigateHost
}

const CameraAccordion = ({
    camera,
    host
}: CameraAccordionProps) => {
    const { recordingsStore: recStore } = useContext(Context)

    const { data, isPending, isError, refetch } = useQuery({
        queryKey: [frigateQueryKeys.getRecordingsSummary, camera?.id],
        queryFn: () => {
            if (camera && host) {
                const hostName = mapHostToHostname(host)
                return proxyApi.getRecordingsSummary(hostName, camera.name, getResolvedTimeZone())
            }
            return null
        }
    })

    const [openedDay, setOpenedDay] = useState<string | null>()

    useEffect(() => {
        if (openedDay) {
            recStore.recordToPlay.cameraName = camera.name
            const hostName = mapHostToHostname(host)
            recStore.recordToPlay.hostName = hostName
        }
    }, [openedDay])

    const handleClick = (value: string | null) => {
        setOpenedDay(value)
    }

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

    console.log('CameraAccordion rendered')

    return (
        <Accordion variant='separated' radius="md" w='100%' onChange={handleClick}>
            {days()}
        </Accordion>
    )
}

export default observer(CameraAccordion);
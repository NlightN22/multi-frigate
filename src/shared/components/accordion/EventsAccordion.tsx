import { Accordion, Center, Loader, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Context } from '../../..';
import { frigateQueryKeys, mapHostToHostname, proxyApi } from '../../../services/frigate.proxy/frigate.api';
import { GetCameraWHostWConfig, GetFrigateHost, getEventsQuerySchema } from '../../../services/frigate.proxy/frigate.schema';
import { getUnixTime } from '../../utils/dateUtil';
import RetryError from '../RetryError';
import EventsAccordionItem from './EventsAccordionItem';

/**
 * @param day frigate format, e.g day: 2024-02-23
 * @param hour frigate format, e.g hour: 22
 * @param cameraName e.g Backyard
 * @param hostName proxy format, e.g hostName: localhost:4000
 */
interface EventsAccordionProps {
    startTime?: number,
    endTime?: number,
    day?: string,
    hour?: string,
    camera: GetCameraWHostWConfig
    host: GetFrigateHost
}

/**
 * @param day frigate format, e.g day: 2024-02-23
 * @param hour frigate format, e.g hour: 22
 * @param cameraName e.g Backyard
 * @param hostName proxy format, e.g hostName: localhost:4000
 */
const EventsAccordion = ({
    startTime,
    endTime,
    day,
    hour,
    camera,
    host,
}: EventsAccordionProps) => {
    const { recordingsStore: recStore } = useContext(Context)
    const [openedItem, setOpenedItem] = useState<string>()

    const { t } = useTranslation()

    const [retryCount, setRetryCount] = useState(0)
    const MAX_RETRY_COUNT = 3

    const hostName = mapHostToHostname(host)
    const isRequiredParams = (host && camera) || !(day && hour) || !(startTime && endTime)

    const { data, isPending, isError, refetch } = useQuery({
        queryKey: [frigateQueryKeys.getEvents, host, camera, day, hour, startTime, endTime],
        queryFn: () => {
            if (!isRequiredParams) return null
            let queryStartTime: number
            let queryEndTime: number
            if (day && hour) {
                [queryStartTime, queryEndTime] = getUnixTime(day, hour)
            } else if (startTime && endTime) {
                queryStartTime = startTime
                queryEndTime = endTime
            }
            else { return null }
            const parsed = getEventsQuerySchema.safeParse({
                hostName: mapHostToHostname(host),
                camerasName: [camera.name],
                after: queryStartTime,
                before: queryEndTime,
                hasClip: true,
                includeThumnails: false,
            })
            if (parsed.success) {
                return proxyApi.getEvents(
                    parsed.data.hostName,
                    parsed.data.camerasName,
                    parsed.data.timezone,
                    parsed.data.hasClip,
                    parsed.data.after,
                    parsed.data.before,
                    parsed.data.labels,
                    parsed.data.limit,
                    parsed.data.includeThumnails,
                    parsed.data.minScore,
                    parsed.data.maxScore
                )
            }
            return null
        },
        retry: (failureCount, error) => {
            setRetryCount(failureCount);

            if (failureCount >= MAX_RETRY_COUNT) return false;

            return true;
        }
    })

    if (isPending) return <Center><Loader /></Center>
    if (isError && retryCount >= MAX_RETRY_COUNT) {
        return (
            <Center>
                <Text>{t('maxRetries', { maxRetries: MAX_RETRY_COUNT })}</Text>
            </Center>
        );
    }
    if (isError) return <RetryError onRetry={refetch} />
    if (!data || data.length < 1) return <Center><Text>{t('notHaveEventsAtThatPeriod')}</Text></Center>

    const handleOpenPlayer = (value: string | undefined) => {
        if (value !== recStore.playedItem) {
            setOpenedItem(value)
            recStore.playedItem = value
        } else if (value === recStore.playedItem) {
            recStore.playedItem = undefined
        }
    }

    const handleOpenItem = (value: string) => {
        if (openedItem === value) {
            setOpenedItem(undefined)
        } else {
            setOpenedItem(value)
        }
        recStore.playedItem = undefined
    }

    if (!hostName) return null

    return (
        <Accordion
            variant='separated'
            radius="md" w='100%'
            value={openedItem}
            onChange={handleOpenItem}
        >
            {data.map(event => (
                <EventsAccordionItem
                    key={event.id}
                    event={event}
                    hostName={hostName}
                    played={recStore.playedItem === event.id}
                    openPlayer={handleOpenPlayer}
                />
            ))}
        </Accordion>
    );
}

export default observer(EventsAccordion);
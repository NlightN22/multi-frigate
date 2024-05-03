import { Accordion, Center, Loader, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { useContext, useState } from 'react';
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
    day: string,
    hour: string,
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
    day,
    hour,
    camera,
    host,
}: EventsAccordionProps) => {
    const { recordingsStore: recStore } = useContext(Context)
    const [openedItem, setOpenedItem] = useState<string>()

    const hostName = mapHostToHostname(host)
    const isRequiredParams = host && camera

    const { data, isPending, isError, refetch } = useQuery({
        queryKey: [frigateQueryKeys.getEvents, host, camera, day, hour],
        queryFn: () => {
            if (!isRequiredParams) return null
            const [startTime, endTime] = getUnixTime(day, hour)
            const parsed = getEventsQuerySchema.safeParse({
                hostName: mapHostToHostname(host),
                camerasName: [camera.name],
                after: startTime,
                before: endTime,
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
        }
    })

    if (isPending) return <Center><Loader /></Center>
    if (isError) return <RetryError onRetry={refetch} />
    if (!data || data.length < 1) return <Center><Text>Not have events at that period</Text></Center>

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

    if (!hostName) throw Error('EventsAccordion hostName must be exist')

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
import { Accordion, Center, Group, Loader, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../..';
import { useQuery } from '@tanstack/react-query';
import { frigateQueryKeys, mapHostToHostname, proxyApi } from '../../../services/frigate.proxy/frigate.api';
import { getEventsQuerySchema } from '../../../services/frigate.proxy/frigate.schema';
import PlayControl from './PlayControl';
import VideoPlayer from '../players/VideoPlayer';
import { getDurationFromTimestamps, getUnixTime, unixTimeToDate } from '../../utils/dateUtil';
import RetryError from '../RetryError';
import { strings } from '../../strings/strings';
import { EventFrigate } from '../../../types/event';

/**
 * @param day frigate format, e.g day: 2024-02-23
 * @param hour frigate format, e.g hour: 22
 * @param cameraName e.g Backyard
 * @param hostName proxy format, e.g hostName: localhost:4000
 */
interface EventsAccordionProps {
    day?: string,
    hour?: string,
    cameraName?: string
    hostName?: string
}

/**
 * @param day frigate format, e.g day: 2024-02-23
 * @param hour frigate format, e.g hour: 22
 * @param cameraName e.g Backyard
 * @param hostName proxy format, e.g hostName: localhost:4000
 */
const EventsAccordion = observer(({
    day,
    hour,
    // TODO labels, score
}: EventsAccordionProps) => {
    const { recordingsStore: recStore } = useContext(Context)
    const [openVideoPlayer, setOpenVideoPlayer] = useState<string>()
    const [openedValue, setOpenedValue] = useState<string>()
    const [playerUrl, setPlayerUrl] = useState<string>()

    const inHost = recStore.selectedHost
    const inCamera = recStore.selectedCamera
    const isRequiredParams = inHost && inCamera
    const { data, isPending, isError, refetch } = useQuery({
        queryKey: [frigateQueryKeys.getEvents, inHost, inCamera, day, hour],
        queryFn: () => {
            if (!isRequiredParams) return null
            const [startTime, endTime] = getUnixTime(day, hour)
            const parsed = getEventsQuerySchema.safeParse({
                hostName: mapHostToHostname(inHost),
                camerasName: [inCamera.name],
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

    useEffect(() => {
        if (openVideoPlayer) {
            console.log('openVideoPlayer', openVideoPlayer)
            if (openVideoPlayer && inHost) {
                const url = proxyApi.eventURL(mapHostToHostname(inHost), openVideoPlayer)
                console.log('GET EVENT URL: ', url)
                setPlayerUrl(url)
            }
        } else {
            setPlayerUrl(undefined)
        }
    }, [openVideoPlayer])

    if (isPending) return <Center><Loader /></Center>
    if (isError) return <RetryError onRetry={refetch} />
    if (!data || data.length < 1) return <Center><Text>Not have events at that period</Text></Center>

    const handleOpenPlayer = (eventId: string) => {
        // console.log(`openVideoPlayer day:${recordSummary.day} hour:${hour}`)
        if (openVideoPlayer !== eventId) {
            setOpenedValue(eventId)
            setOpenVideoPlayer(eventId)
        } else if (openedValue === eventId && openVideoPlayer === eventId) {
            setOpenVideoPlayer(undefined)
        }
    }

    const handleClick = (value: string) => {
        if (openedValue === value) {
            setOpenedValue(undefined)
        } else {
            setOpenedValue(value)
        }
        setOpenVideoPlayer(undefined)
    }

    const eventLabel = (event: EventFrigate) => {
        const time = unixTimeToDate(event.start_time)
        const duration = getDurationFromTimestamps(event.start_time, event.end_time)
        return (
            <Group>
                <Text>{strings.player.object}: {event.label}</Text>
                <Text>{time}</Text>
                {duration ?
                    <Text>{duration}</Text>
                    : <></>}
            </Group>
        )
    }

    return (
        <Accordion
            variant='separated'
            radius="md" w='100%'
            value={openedValue}
            onChange={handleClick}
        >
            {data.map(event => (
                <Accordion.Item key={event.id + 'Item'} value={event.id}>
                    <Accordion.Control key={event.id + 'Control'}>
                        <PlayControl
                            label={eventLabel(event)}
                            value={event.id}
                            openVideoPlayer={openVideoPlayer}
                            onClick={handleOpenPlayer} />
                    </Accordion.Control>
                    <Accordion.Panel key={event.id + 'Panel'}>
                        {openVideoPlayer === event.id && playerUrl ? <VideoPlayer videoUrl={playerUrl} /> : <></>}
                        <Group mt='1rem'>
                            <Text>{strings.camera}: {event.camera}</Text>
                            <Text>{strings.player.object}: {event.label}</Text>
                        </Group>
                        <Group>
                            <Text>{strings.player.startTime}: {unixTimeToDate(event.start_time)}</Text>
                            <Text>{strings.player.duration}: {getDurationFromTimestamps(event.start_time, event.end_time)}</Text>
                        </Group>
                    </Accordion.Panel>
                </Accordion.Item>
            ))}
        </Accordion>
    );
})

export default EventsAccordion;
import { Accordion, Center, Flex, Group, Loader, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../..';
import { useQuery } from '@tanstack/react-query';
import { frigateQueryKeys, mapHostToHostname, proxyApi } from '../../../services/frigate.proxy/frigate.api';
import { getEventsQuerySchema } from '../../../services/frigate.proxy/frigate.schema';
import PlayControl from '../buttons/PlayControl';
import { getDurationFromTimestamps, getUnixTime, unixTimeToDate } from '../../utils/dateUtil';
import RetryError from '../RetryError';
import { strings } from '../../strings/strings';
import { EventFrigate } from '../../../types/event';
import { IconExternalLink } from '@tabler/icons-react';
import { routesPath } from '../../../router/routes.path';
import AccordionControlButton from '../buttons/AccordionControlButton';
import AccordionShareButton from '../buttons/AccordionShareButton';
import { useNavigate } from 'react-router-dom';
import EventPanel from './EventPanel';

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
const EventsAccordion = ({
    day,
    hour,
    // TODO labels, score
}: EventsAccordionProps) => {
    const { recordingsStore: recStore } = useContext(Context)
    const [playedValue, setPlayedValue] = useState<string>()
    const [openedItem, setOpenedItem] = useState<string>()
    const [playerUrl, setPlayerUrl] = useState<string>()
    const navigate = useNavigate()

    const host = recStore.filteredHost
    const hostName = mapHostToHostname(host)
    const camera = recStore.openedCamera || recStore.filteredCamera
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

    const createEventUrl = (eventId: string) => {
        if (hostName)
            return proxyApi.eventURL(hostName, eventId)
        return undefined
    }

    useEffect(() => {
        if (playedValue) {
            // console.log('openVideoPlayer', playedValue)
            if (playedValue && host) {
                const url = createEventUrl(playedValue)
                console.log('GET EVENT URL: ', url)
                setPlayerUrl(url)
            }
        } else {
            setPlayerUrl(undefined)
        }
    }, [playedValue])

    if (isPending) return <Center><Loader /></Center>
    if (isError) return <RetryError onRetry={refetch} />
    if (!data || data.length < 1) return <Center><Text>Not have events at that period</Text></Center>

    const handleOpenPlayer = (openedValue: string) => {
        // console.log(`openVideoPlayer day:${day} hour:${hour}, opened value: ${openedValue}`)
        // console.log(`opened value: ${openedValue}, eventId: ${playedValue}`)
        if (openedValue !== playedValue) {
            setOpenedItem(openedValue)
            setPlayedValue(openedValue)
        } else if (openedValue === playedValue && playedValue === playedValue) {
            setPlayedValue(undefined)
        }
    }

    const handleOpenItem = (value: string) => {
        if (playedValue === value) {
            setOpenedItem(undefined)
        } else {
            setOpenedItem(value)
        }
        setPlayedValue(undefined)
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

    const hanleOpenNewLink = (recordId: string) => {
        const link = createEventUrl(recordId)
        if (link) {
            const url = `${routesPath.PLAYER_PATH}?link=${encodeURIComponent(link)}`
            navigate(url)
        }
    }

    return (
        <Accordion
            variant='separated'
            radius="md" w='100%'
            value={openedItem}
            onChange={handleOpenItem}
        >
            {data.map(event => (
                <Accordion.Item key={event.id + 'Item'} value={event.id}>
                    <Accordion.Control key={event.id + 'Control'}>
                        <Flex justify='space-between'>
                            {eventLabel(event)}
                            <Group>
                                <AccordionShareButton recordUrl={createEventUrl(event.id)} />
                                <AccordionControlButton onClick={() => hanleOpenNewLink(event.id)}>
                                    <IconExternalLink />
                                </AccordionControlButton>
                                <PlayControl
                                    value={event.id}
                                    playedValue={playedValue}
                                    onClick={handleOpenPlayer} />
                            </Group>
                        </Flex>
                    </Accordion.Control>
                    <Accordion.Panel key={event.id + 'Panel'}>
                        <EventPanel 
                        event={event} 
                        playedValue={playedValue} 
                        playerUrl={playerUrl} 
                        hostName={hostName} />
                    </Accordion.Panel>
                </Accordion.Item>
            ))}
        </Accordion>
    );
}

export default observer(EventsAccordion);
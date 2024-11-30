import { Accordion, Flex, Group, Text } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import React, { useCallback, useEffect, useState } from 'react';
import AccordionControlButton from '../buttons/AccordionControlButton';
import AccordionShareButton from '../buttons/AccordionShareButton';
import PlayControl from '../buttons/PlayControl';
import EventPanel from './EventPanel';
import { EventFrigate } from '../../../types/event';
import { unixTimeToDate, getDurationFromTimestamps } from '../../utils/dateUtil';
import { useNavigate } from 'react-router-dom';
import { routesPath } from '../../../router/routes.path';
import { proxyApi } from '../../../services/frigate.proxy/frigate.api';
import { useTranslation } from 'react-i18next';
import BlobImage from '../images/BlobImage';
import OnScreenImage from '../images/OnScreenImage';


interface EventsAccordionItemProps {
    event: EventFrigate
    hostName: string
    played?: boolean
    openPlayer?: (value?: string) => void,
}

const EventsAccordionItem = ({
    event,
    hostName,
    played,
    openPlayer,
}: EventsAccordionItemProps) => {
    const { t } = useTranslation()
    const [playedURL, setPlayedUrl] = useState<string>()

    const navigate = useNavigate()

    const createEventUrl = useCallback((eventId: string) => {
        if (hostName)
            return proxyApi.eventURL(hostName, eventId)
        return undefined
    }, [hostName])

    const eventVideoURL = createEventUrl(event.id)

    const eventLabel = (event: EventFrigate) => {
        const time = unixTimeToDate(event.start_time)
        const duration = getDurationFromTimestamps(event.start_time, event.end_time)
        return (
            <Group>
                <Text fw={700}>{t('player.object')}:</Text>
                <Text >{event.label}</Text>
                <Text>{time}</Text>
                {duration ?
                    <Text>{duration}</Text>
                    : <></>}
            </Group>
        )
    }

    const hanleOpenNewLink = () => {
        const link = eventVideoURL
        if (link) {
            const url = `${routesPath.PLAYER_PATH}?link=${encodeURIComponent(link)}`
            navigate(url)
        }
    }

    const handleOpenPlayer = () => {
        if (openPlayer) openPlayer(event.id)
    }

    useEffect(() => {
        if (played) {
            setPlayedUrl(eventVideoURL)
        } else {
            setPlayedUrl(undefined)
        }
    }, [played])

    return (
        <Accordion.Item key={event.id + 'Item'} value={event.id}>
            <Accordion.Control key={event.id + 'Control'}>
                <Flex justify='space-between'>
                    {!hostName ? <></> :
                        <OnScreenImage
                            maw={200}
                            mr='1rem'
                            fit="contain"
                            withPlaceholder
                            src={proxyApi.eventThumbnailUrl(hostName, event.id)} />
                    }
                    {eventLabel(event)}
                    <Group>
                        <AccordionShareButton recordUrl={eventVideoURL} />
                        <AccordionControlButton onClick={hanleOpenNewLink}>
                            <IconExternalLink />
                        </AccordionControlButton>
                        <PlayControl
                            played={played ? played : false}
                            onClick={handleOpenPlayer} />
                    </Group>
                </Flex>
            </Accordion.Control>
            <Accordion.Panel key={event.id + 'Panel'}>
                <EventPanel
                    event={event}
                    videoURL={eventVideoURL}
                    playedURL={playedURL}
                    hostName={hostName} />
            </Accordion.Panel>
        </Accordion.Item>
    );
};

export default EventsAccordionItem;
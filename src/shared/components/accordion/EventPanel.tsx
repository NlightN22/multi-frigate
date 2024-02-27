import { Flex, Group, Button, Text, Image } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import React from 'react';
import { proxyApi } from '../../../services/frigate.proxy/frigate.api';
import { strings } from '../../strings/strings';
import { unixTimeToDate, getDurationFromTimestamps } from '../../utils/dateUtil';
import VideoPlayer from '../players/VideoPlayer';
import { EventFrigate } from '../../../types/event';
import BlobImage from '../images/BlobImage';

interface EventPanelProps {
    event: EventFrigate
    playedValue?: string
    playerUrl?: string
    hostName?: string
}

const EventPanel = ({
    event,
    playedValue,
    playerUrl,
    hostName,
}: EventPanelProps) => {
    return (
        <>
            {playedValue === event.id && playerUrl ? <VideoPlayer videoUrl={playerUrl} /> : <></>}
            <Flex w='100%' justify='space-between'>
                {!hostName ? <></> :
                    <BlobImage
                        maw={200}
                        fit="contain"
                        withPlaceholder
                        src={proxyApi.eventThumbnailUrl(hostName, event.id)} />
                }
                <Flex direction='column' align='end' justify='center'>
                    {!hostName ? '' :
                        <Flex>
                            <Button
                                component="a"
                                href={proxyApi.eventDownloadURL(hostName, event.id)}
                                download
                                variant="outline"
                                leftIcon={<IconExternalLink size="0.9rem" />}>
                                Download event
                            </Button>
                        </Flex>
                    }
                    <Text mt='1rem'>{strings.camera}: {event.camera}</Text>
                    <Text>{strings.player.object}: {event.label}</Text>
                    <Text>{strings.player.startTime}: {unixTimeToDate(event.start_time)}</Text>
                    <Text>{strings.player.duration}: {getDurationFromTimestamps(event.start_time, event.end_time)}</Text>
                    {!event.data?.score? <></> :
                        <Text>{strings.player.rating}: {(event.data.score * 100).toFixed(2)}%</Text>
                    }
                </Flex>
            </Flex>
        </>
    )
}

export default EventPanel;
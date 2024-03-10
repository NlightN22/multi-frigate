import { Button, Flex, Text } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { proxyApi } from '../../../services/frigate.proxy/frigate.api';
import { EventFrigate } from '../../../types/event';
import { getDurationFromTimestamps, unixTimeToDate } from '../../utils/dateUtil';
import BlobImage from '../images/BlobImage';
import VideoPlayer from '../players/VideoPlayer';
import { useTranslation } from 'react-i18next';

interface EventPanelProps {
    event: EventFrigate
    hostName?: string
    videoURL?: string,
    playedURL?: string,
}

const EventPanel = ({
    event,
    hostName,
    videoURL,
    playedURL,
}: EventPanelProps) => {
    const { t } = useTranslation()

    return (
        <>
            {playedURL && playedURL === videoURL ? <VideoPlayer videoUrl={playedURL} /> : <></>}
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
                    <Text mt='1rem'>{t('camera')}: {event.camera}</Text>
                    <Text>{t('player.object')}: {event.label}</Text>
                    <Text>{t('player.startTime')}: {unixTimeToDate(event.start_time)}</Text>
                    <Text>{t('player.duration')}: {getDurationFromTimestamps(event.start_time, event.end_time)}</Text>
                    {!event.data?.score? <></> :
                        <Text>{t('player.rating')}: {(event.data.score * 100).toFixed(2)}%</Text>
                    }
                </Flex>
            </Flex>
        </>
    )
}

export default EventPanel;
import { Button, Flex, Group, Text } from '@mantine/core';
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
                <Group spacing='xs'>
                    <Text fw={700}>{t('camera')}:</Text>
                    <Text>{event.camera}</Text>
                </Group>
                <Group>
                    <Text fw={700}>{t('player.startTime')}:</Text>
                    <Text>{unixTimeToDate(event.start_time)}</Text>
                </Group>
                <Group>
                    <Text fw={700}>{t('player.duration')}:</Text>
                    <Text>{getDurationFromTimestamps(event.start_time, event.end_time)}</Text>
                </Group>
                {!event.data?.score ? <></> :
                    <Group>
                        <Text fw={700}>{t('player.rating')}:</Text>
                        <Text>{(event.data.score * 100).toFixed(2)}%</Text>
                    </Group>
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
                </Flex>
            </Flex>
        </>
    )
}

export default EventPanel;
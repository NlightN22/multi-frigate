import { Accordion, Center, Flex, Text } from '@mantine/core';
import VideoDownloader from '../../../widgets/VideoDownloader';
import VideoPlayer from '../players/VideoPlayer';
import DayEventsAccordion from './DayEventsAccordion';
import { useTranslation } from 'react-i18next';
import { GetCameraWHostWConfig, GetFrigateHost } from '../../../services/frigate.proxy/frigate.schema';

interface DayPanelProps {
    day: string,
    hour: string,
    events: number,
    videoURL?: string,
    hostName?: string,
    cameraName?: string,
    playedURL?: string,
    startUnixTime: number,
    endUnixTime: number,
    camera: GetCameraWHostWConfig
    host: GetFrigateHost
}

const DayPanel = ({
    day,
    hour,
    events,
    hostName,
    cameraName,
    videoURL,
    playedURL,
    startUnixTime,
    endUnixTime,
    camera,
    host
}: DayPanelProps) => {
    const { t } = useTranslation()
    return (
        <Accordion.Panel key={hour + 'Panel'}>
            {playedURL && playedURL === videoURL ? <VideoPlayer videoUrl={playedURL} /> : <></>}
            {cameraName && hostName ?
                <Flex w='100%' justify='center' mb='0.5rem' mt='1rem'>
                    <VideoDownloader
                        cameraName={cameraName}
                        hostName={hostName}
                        startUnixTime={startUnixTime}
                        endUnixTime={endUnixTime}
                    />
                </Flex>
                : ''}
            {events > 0 ?
                <DayEventsAccordion
                    camera={camera}
                    host={host}
                    day={day}
                    hour={hour}
                    qty={events} />
                :
                <Center><Text>{t('notHaveEvents')}</Text></Center>
            }
        </Accordion.Panel>
    );
};

export default DayPanel;
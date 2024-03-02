import { Accordion, Center, Flex, Text } from '@mantine/core';
import VideoDownloader from '../../../widgets/VideoDownloader';
import { strings } from '../../strings/strings';
import VideoPlayer from '../players/VideoPlayer';
import DayEventsAccordion from './DayEventsAccordion';

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
}: DayPanelProps) => {
    return (
        <Accordion.Panel key={hour + 'Panel'}>
            {playedURL && playedURL === videoURL ? <VideoPlayer videoUrl={playedURL} /> : <></>}
            {cameraName && hostName ?
                <Flex w='100%' justify='center' mb='0.5rem'>
                    <VideoDownloader
                        cameraName={cameraName}
                        hostName={hostName}
                        startUnixTime={startUnixTime}
                        endUnixTime={endUnixTime}
                    />
                </Flex>
                : ''}
            {events > 0 ?
                <DayEventsAccordion day={day} hour={hour} qty={events} />
                :
                <Center><Text>{strings.notHaveEvents}</Text></Center>
            }
        </Accordion.Panel>
    );
};

export default DayPanel;
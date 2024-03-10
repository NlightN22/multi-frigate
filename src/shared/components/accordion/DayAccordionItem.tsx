import { Accordion, Flex, Group, Text } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { routesPath } from '../../../router/routes.path';
import { proxyApi } from '../../../services/frigate.proxy/frigate.api';
import { RecordHour, RecordSummary } from '../../../types/record';
import { isProduction } from '../../env.const';
import { getResolvedTimeZone, mapDateHourToUnixTime } from '../../utils/dateUtil';
import AccordionControlButton from '../buttons/AccordionControlButton';
import AccordionShareButton from '../buttons/AccordionShareButton';
import PlayControl from '../buttons/PlayControl';
import DayPanel from './DayPanel';

interface DayAccordionItemProps {
    recordSummary: RecordSummary,
    recordHour: RecordHour,
    hostName?: string,
    cameraName?: string,
    played?: boolean,
    openPlayer?: (value?: string) => void,
}

const DayAccordionItem = ({
    recordSummary,
    recordHour,
    hostName,
    cameraName,
    played,
    openPlayer
}: DayAccordionItemProps) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [playedURL, setPlayedUrl] = useState<string>()

    const hour = recordHour.hour
    const day = recordSummary.day
    const item = day + hour
    const recordURL = proxyApi.recordingURL(
        hostName,
        cameraName,
        getResolvedTimeZone().replace('/', ','),
        recordSummary.day,
        hour,
    )

    const startUnixTime = mapDateHourToUnixTime(day, hour)[0]
    const endUnixTime = mapDateHourToUnixTime(day, hour)[1]

    const hanleOpenNewLink = () => {
        if (recordURL) {
            const url = `${routesPath.PLAYER_PATH}?link=${encodeURIComponent(recordURL)}`
            navigate(url)
        }
    }

    const handleOpenPlayer = () => {
        if (openPlayer) openPlayer(item)
    }

    useEffect(() => {
        if (played) {
            setPlayedUrl(recordURL)
        } else {
            setPlayedUrl(undefined)
        }
    }, [played])

    if (!isProduction) console.log('DayAccordionItem rendered')
    return (
        <Accordion.Item value={item}>
            <Accordion.Control key={hour + 'Control'}>
                <Flex justify='space-between'>
                    <Group>
                        <Text>{t('hour')}: {hour}:00</Text>
                        {recordHour.events > 0 ?
                            <Text>{t('events')}: {recordHour.events}</Text>
                            :
                            <Text>{t('notHaveEvents')}</Text>
                        }
                    </Group>
                    <Group>
                        <AccordionShareButton recordUrl={recordURL} />
                        <AccordionControlButton onClick={hanleOpenNewLink}>
                            <IconExternalLink />
                        </AccordionControlButton>
                        <PlayControl
                            played={played ? played : false}
                            onClick={handleOpenPlayer} />
                    </Group>
                </Flex>
            </Accordion.Control>
            <DayPanel
                day={recordSummary.day}
                hour={hour}
                events={recordHour.events}
                hostName={hostName}
                cameraName={cameraName}
                startUnixTime={startUnixTime}
                endUnixTime={endUnixTime}
                videoURL={recordURL}
                playedURL={playedURL}
            />
        </Accordion.Item>
    );
};

export default DayAccordionItem;
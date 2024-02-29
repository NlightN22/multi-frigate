import { Accordion, Center, Flex, Group, NavLink, Progress, Text, UnstyledButton } from '@mantine/core';
import React, { useContext, useEffect, useState } from 'react';
import { RecordSummary } from '../../../types/record';
import { observer } from 'mobx-react-lite';
import PlayControl from '../buttons/PlayControl';
import { mapHostToHostname, proxyApi } from '../../../services/frigate.proxy/frigate.api';
import { Context } from '../../..';
import VideoPlayer from '../players/VideoPlayer';
import { getResolvedTimeZone, mapDateHourToUnixTime } from '../../utils/dateUtil';
import DayEventsAccordion from './DayEventsAccordion';
import { strings } from '../../strings/strings';
import { useNavigate } from 'react-router-dom';
import AccordionControlButton from '../buttons/AccordionControlButton';
import { IconExternalLink, IconShare } from '@tabler/icons-react';
import { routesPath } from '../../../router/routes.path';
import AccordionShareButton from '../buttons/AccordionShareButton';
import VideoDownloader from '../../../widgets/VideoDownloader';
import { isProduction } from '../../env.const';

interface RecordingAccordionProps {
  recordSummary?: RecordSummary
}

const DayAccordion = ({
  recordSummary
}: RecordingAccordionProps) => {
  const { recordingsStore: recStore } = useContext(Context)
  const [playedValue, setVideoPlayerState] = useState<string>()
  const [openedValue, setOpenedValue] = useState<string>()
  const [playerUrl, setPlayerUrl] = useState<string>()
  const navigate = useNavigate()

  const camera = recStore.openedCamera || recStore.filteredCamera
  const hostName = mapHostToHostname(recStore.filteredHost)

  const createRecordURL = (recordId: string): string | undefined => {
    const record = {
      hostName: hostName ? hostName : '',
      cameraName: camera?.name,
      day: recordSummary?.day,
      hour: recordId,
      timezone: getResolvedTimeZone().replace('/', ','),
    }
    const parsed = recStore.getFullRecordForPlay(record)
    if (parsed.success) {
      return proxyApi.recordingURL(
        parsed.data.hostName,
        parsed.data.cameraName,
        parsed.data.timezone,
        parsed.data.day,
        parsed.data.hour
      )
    }
    return undefined
  }

  useEffect(() => {
    if (playedValue) {
      const url = createRecordURL(playedValue)
      if (url) {
        if (!isProduction) console.log('GET URL: ', url)
        setPlayerUrl(url)
      }
    } else {
      setPlayerUrl(undefined)
    }
  }, [playedValue])

  if (!recordSummary || recordSummary.hours.length < 1) return <Text>Not have record at that day</Text>

  const handleOpenPlayer = (value: string) => {
    if (playedValue !== value) {
      setOpenedValue(value)
      setVideoPlayerState(value)
    } else if (openedValue === value && playedValue === value) {
      setVideoPlayerState(undefined)
    }
  }

  const handleOpenItem = (value: string) => {
    if (openedValue === value) {
      setOpenedValue(undefined)
    } else {
      setOpenedValue(value)
    }
    setVideoPlayerState(undefined)
  }

  if (!isProduction) console.log('DayAccordion rendered')

  const hourLabel = (hour: string, eventsQty: number) => (
    <Group>
      <Text>{strings.hour}: {hour}:00</Text>
      {eventsQty > 0 ?
        <Text>{strings.events}: {eventsQty}</Text>
        :
        <Text>{strings.notHaveEvents}</Text>
      }
    </Group>
  )

  const hanleOpenNewLink = (recordId: string) => {
    const link = createRecordURL(recordId)
    if (link) {
      const url = `${routesPath.PLAYER_PATH}?link=${encodeURIComponent(link)}`
      navigate(url)
    }
  }

  return (
    <Accordion
      key={recordSummary.day}
      variant='separated'
      radius="md" w='100%'
      value={openedValue}
      onChange={handleOpenItem}
    >
      {recordSummary.hours.map(hour => (
        <Accordion.Item key={hour.hour + 'Item'} value={hour.hour}>
          <Accordion.Control key={hour.hour + 'Control'}>
            <Flex justify='space-between'>
              {hourLabel(hour.hour, hour.events)}
              <Group>
                <AccordionShareButton recordUrl={createRecordURL(hour.hour)} />
                <AccordionControlButton onClick={() => hanleOpenNewLink(hour.hour)}>
                  <IconExternalLink />
                </AccordionControlButton>
                <PlayControl
                  value={hour.hour}
                  playedValue={playedValue}
                  onClick={handleOpenPlayer} />
              </Group>
            </Flex>
          </Accordion.Control>
          <Accordion.Panel key={hour.hour + 'Panel'}>
            {playedValue === hour.hour && playerUrl ? <VideoPlayer videoUrl={playerUrl} /> : <></>}
            { }
            {recStore.filteredHost && camera && hostName ?
              <Flex w='100%' justify='center' mb='0.5rem'>
                <VideoDownloader
                  cameraName={camera.name}
                  hostName={hostName}
                  startUnixTime={mapDateHourToUnixTime(recordSummary.day, hour.hour)[0]}
                  endUnixTime={mapDateHourToUnixTime(recordSummary.day, hour.hour)[1]}
                />
              </Flex>
              : ''}
            {hour.events > 0 ?
              <DayEventsAccordion day={recordSummary.day} hour={hour.hour} qty={hour.events} />
              :
              <Center><Text>{strings.notHaveEvents}</Text></Center>
            }
          </Accordion.Panel>
        </Accordion.Item>
      ))}

    </Accordion>

  )
}

export default observer(DayAccordion);
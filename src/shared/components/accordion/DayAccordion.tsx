import { Accordion, Center, Flex, Group, NavLink, Text, UnstyledButton } from '@mantine/core';
import React, { useContext, useEffect, useState } from 'react';
import { RecordSummary } from '../../../types/record';
import { observer } from 'mobx-react-lite';
import PlayControl from '../buttons/PlayControl';
import { mapHostToHostname, proxyApi } from '../../../services/frigate.proxy/frigate.api';
import { Context } from '../../..';
import VideoPlayer from '../players/VideoPlayer';
import { getResolvedTimeZone } from '../../utils/dateUtil';
import DayEventsAccordion from './DayEventsAccordion';
import { strings } from '../../strings/strings';
import { useNavigate } from 'react-router-dom';
import AccordionControlButton from '../buttons/AccordionControlButton';
import { IconExternalLink, IconShare } from '@tabler/icons-react';
import { routesPath } from '../../../router/routes.path';
import AccordionShareButton from '../buttons/AccordionShareButton';

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
  const [link, setLink] = useState<string>()
  const navigate = useNavigate()

  const camera = recStore.openedCamera || recStore.filteredCamera

  const createRecordURL = (recordId: string): string | undefined => {
    const record = {
      hostName: recStore.filteredHost ? mapHostToHostname(recStore.filteredHost) : '',
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
        console.log('GET URL: ', url)
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

  console.log('DayAccordion rendered')

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
                <AccordionShareButton recordUrl={createRecordURL(hour.hour)}/>
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
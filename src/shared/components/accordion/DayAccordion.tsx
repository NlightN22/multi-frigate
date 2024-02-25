import { Accordion, Center, Group, Text } from '@mantine/core';
import React, { useContext, useEffect, useState } from 'react';
import { RecordSummary } from '../../../types/record';
import { observer } from 'mobx-react-lite';
import PlayControl from './PlayControl';
import { proxyApi } from '../../../services/frigate.proxy/frigate.api';
import { Context } from '../../..';
import VideoPlayer from '../players/VideoPlayer';
import { getResolvedTimeZone } from '../../utils/dateUtil';
import DayEventsAccordion from './DayEventsAccordion';
import { strings } from '../../strings/strings';

interface RecordingAccordionProps {
  recordSummary?: RecordSummary
}

const DayAccordion = ({
  recordSummary
}: RecordingAccordionProps) => {
  const { recordingsStore: recStore } = useContext(Context)
  const [openVideoPlayer, setOpenVideoPlayer] = useState<string>()
  const [openedValue, setOpenedValue] = useState<string>()
  const [playerUrl, setPlayerUrl] = useState<string>()

  useEffect(() => {
    if (openVideoPlayer) {
      console.log('openVideoPlayer', openVideoPlayer)
      if (openVideoPlayer) {
        recStore.recordToPlay.day = recordSummary?.day
        recStore.recordToPlay.hour = openVideoPlayer
        recStore.recordToPlay.timezone = getResolvedTimeZone().replace('/', ',')
        const parsed = recStore.getFullRecordForPlay(recStore.recordToPlay)
        console.log('recordingsStore.playedRecord: ', recStore.recordToPlay)
        if (parsed.success) {
          const url = proxyApi.recordingURL(
            parsed.data.hostName,
            parsed.data.cameraName,
            parsed.data.timezone,
            parsed.data.day,
            parsed.data.hour
          )
          console.log('GET URL: ', url)
          setPlayerUrl(url)
        }
      }
    } else {
      setPlayerUrl(undefined)
    }
  }, [openVideoPlayer])

  if (!recordSummary ) return <Text>Not have record at that day</Text>
  if (recordSummary.hours.length < 1) return <Text>Not have record at that day</Text>

  const handleOpenPlayer = (hour: string) => {
    if (openVideoPlayer !== hour) {
      setOpenedValue(hour)
      setOpenVideoPlayer(hour)
    } else if (openedValue === hour && openVideoPlayer === hour) {
      setOpenVideoPlayer(undefined)
    }
  }

  const handleClick = (value: string) => {
    if (openedValue === value) {
      setOpenedValue(undefined)
    } else {
      setOpenedValue(value)
    }
    setOpenVideoPlayer(undefined)
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

  return (
    <Accordion
      key={recordSummary.day}
      variant='separated'
      radius="md" w='100%'
      value={openedValue}
      onChange={handleClick}
    >
      {recordSummary.hours.map(hour => (
        <Accordion.Item key={hour.hour + 'Item'} value={hour.hour}>
          <Accordion.Control key={hour.hour + 'Control'}>
            <PlayControl
              label={hourLabel(hour.hour, hour.events)}
              value={hour.hour}
              openVideoPlayer={openVideoPlayer}
              onClick={handleOpenPlayer} />
          </Accordion.Control>
          <Accordion.Panel key={hour.hour + 'Panel'}>
            {openVideoPlayer === hour.hour && playerUrl ? <VideoPlayer videoUrl={playerUrl} /> : <></>}
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
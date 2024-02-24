import { Accordion, Center, Flex, Group, Text } from '@mantine/core';
import React, { useContext, useEffect, useState } from 'react';
import { RecordHour, RecordSummary, Recording } from '../../../types/record';
import Button from '../frigate/Button';
import { IconPlayerPause, IconPlayerPlay, IconPlayerStop } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import PlayControl from './PlayControl';
import { frigateApi, proxyApi } from '../../../services/frigate.proxy/frigate.api';
import { Context } from '../../..';
import VideoPlayer from '../frigate/VideoPlayer';
import { getResolvedTimeZone } from '../frigate/dateUtil';
import EventsAccordion from './EventsAccordion';
import DayEventsAccordion from './DayEventsAccordion';

interface RecordingAccordionProps {
  recordSummary?: RecordSummary
}

const DayAccordion = observer(({
  recordSummary
}: RecordingAccordionProps) => {
  const { recordingsStore } = useContext(Context)
  const [openVideoPlayer, setOpenVideoPlayer] = useState<string>()
  const [openedValue, setOpenedValue] = useState<string>()
  const [playerUrl, setPlayerUrl] = useState<string>()

  useEffect(() => {
    if (openVideoPlayer) {
      console.log('openVideoPlayer', openVideoPlayer)
      if (openVideoPlayer) {
        recordingsStore.recordToPlay.day = recordSummary?.day
        recordingsStore.recordToPlay.hour = openVideoPlayer
        recordingsStore.recordToPlay.timezone = getResolvedTimeZone().replace('/', ',')
        const parsed = recordingsStore.getFullRecordForPlay(recordingsStore.recordToPlay)
        console.log('recordingsStore.playedRecord: ', recordingsStore.recordToPlay)
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

  if (!recordSummary || recordSummary.hours.length < 1) return (<Text>Not have record at that day</Text>)

  const handleOpenPlayer = (hour: string) => {
    // console.log(`openVideoPlayer day:${recordSummary.day} hour:${hour}`)
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

  return (
    <Accordion
      key={recordSummary.day}
      variant='separated'
      radius="md" w='100%'
      value={openedValue}
      onChange={handleClick}
    >
      {recordSummary.hours.slice(0, 5).map(hour => (
        <Accordion.Item key={hour.hour + 'Item'} value={hour.hour}>
          <Accordion.Control key={hour.hour + 'Control'}>
            <PlayControl label={`Hour ${hour.hour}`} value={hour.hour} openVideoPlayer={openVideoPlayer} onClick={handleOpenPlayer} />
          </Accordion.Control>
          <Accordion.Panel key={hour.hour + 'Panel'}>
            {openVideoPlayer === hour.hour && playerUrl ? <VideoPlayer videoUrl={playerUrl} /> : <></>}
            {hour.events > 0 ?
              <DayEventsAccordion day={recordSummary.day} hour={hour.hour} qty={hour.events} />
              :
              <Center><Text>Not have events</Text></Center>
            }
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  )
})

export default DayAccordion;
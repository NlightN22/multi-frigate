import { Accordion, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Context } from '../../..';
import { mapHostToHostname } from '../../../services/frigate.proxy/frigate.api';
import { RecordSummary } from '../../../types/record';
import { isProduction } from '../../env.const';
import DayAccordionItem from './DayAccordionItem';
import { GetCameraWHostWConfig, GetFrigateHost } from '../../../services/frigate.proxy/frigate.schema';

interface RecordingAccordionProps {
  recordSummary?: RecordSummary
  host: GetFrigateHost
  camera: GetCameraWHostWConfig
}

const DayAccordionItemMemo = React.memo(DayAccordionItem)

const DayAccordion = ({
  recordSummary,
  host,
  camera
}: RecordingAccordionProps) => {
  const { recordingsStore: recStore } = useContext(Context)
  const [openedValue, setOpenedValue] = useState<string>()

  const hostName = mapHostToHostname(host)

  const handleOpenPlayer = useCallback((value?: string) => {
    if (recStore.playedItem !== value) {
      setOpenedValue(value);
      recStore.playedItem = value;
    } else if (openedValue === value && recStore.playedItem === value) {
      recStore.playedItem = undefined;
    }
  }, [openedValue, recStore.playedItem]);

  const dayItems = useMemo(() => {
    if (recordSummary && recordSummary.hours.length > 0 && hostName && host) {
      return recordSummary.hours.map(hour => {
        const item = hostName + camera.name +  recordSummary.day + hour.hour
        const played = item === recStore.playedItem;
        return (
          <DayAccordionItemMemo
            camera={camera}
            host={host}
            key={recordSummary.day + hour.hour}
            recordSummary={recordSummary}
            recordHour={hour}
            hostName={hostName}
            cameraName={camera?.name}
            played={played}
            openPlayer={handleOpenPlayer}
          />
        );
      });
    }
    return [];
  }, [recordSummary, hostName, camera, recStore.playedItem, handleOpenPlayer])

  if (!recordSummary || recordSummary.hours.length < 1) return <Text>Not have record at {recordSummary?.day}</Text>

  const handleOpenItem = (value: string) => {
    setOpenedValue(value !== openedValue ? value : undefined)
    recStore.playedItem = undefined
  }

  if (!isProduction) console.log('DayAccordion rendered')

  return (
    <Accordion
      key={recordSummary.day}
      variant='separated'
      radius="md" w='100%'
      value={openedValue}
      onChange={handleOpenItem}
    >
      {dayItems}
    </Accordion>

  )
}

export default observer(DayAccordion);
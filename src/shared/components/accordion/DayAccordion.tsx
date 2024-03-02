import { Accordion, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Context } from '../../..';
import { mapHostToHostname } from '../../../services/frigate.proxy/frigate.api';
import { RecordSummary } from '../../../types/record';
import { isProduction } from '../../env.const';
import DayAccordionItem from './DayAccordionItem';

interface RecordingAccordionProps {
  recordSummary?: RecordSummary,
}

const DayAccordionItemMemo = React.memo(DayAccordionItem)

const DayAccordion = ({
  recordSummary,
}: RecordingAccordionProps) => {
  const { recordingsStore: recStore } = useContext(Context)
  const [openedValue, setOpenedValue] = useState<string>()

  const camera = recStore.openedCamera || recStore.filteredCamera
  const hostName = mapHostToHostname(recStore.filteredHost)

  const handleOpenPlayer = useCallback((value?: string) => {
    if (recStore.playedItem !== value) {
      setOpenedValue(value);
      recStore.playedItem = value;
    } else if (openedValue === value && recStore.playedItem === value) {
      recStore.playedItem = undefined;
    }
  }, [openedValue, recStore]);

  const dayItems = useMemo(() => {
    if (recordSummary && recordSummary.hours.length > 0) {
      return recordSummary.hours.map(hour => {
        const played = recordSummary.day + hour.hour === recStore.playedItem;
        return (
          <DayAccordionItemMemo
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
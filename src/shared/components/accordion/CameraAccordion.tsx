import { Accordion, Center, Text } from '@mantine/core';
import React, { useContext, useEffect, useState } from 'react';
import { GetCameraWHostWConfig, GetFrigateHost } from '../../../services/frigate.proxy/frigate.schema';
import { useQuery } from '@tanstack/react-query';
import { frigateQueryKeys, mapHostToHostname, proxyApi } from '../../../services/frigate.proxy/frigate.api';
import CogwheelLoader from '../CogwheelLoader';
import DayAccordion from './DayAccordion';
import { observer } from 'mobx-react-lite';
import { Context } from '../../..';

interface CameraAccordionProps {
    camera: GetCameraWHostWConfig,
    host: GetFrigateHost
}

const CameraAccordion = observer(({
    camera,
    host
}: CameraAccordionProps) => {
    const { recordingsStore } = useContext(Context)

    const { data, isPending, isError } = useQuery({
        queryKey: [frigateQueryKeys.getRecordingsSummary, camera?.id],
        queryFn: () => {
            if (camera && host) {
                const hostName = mapHostToHostname(host)
                return proxyApi.getRecordingsSummary(hostName, camera.name, 'Asia/Krasnoyarsk')
            }
            return null
        }
    })

    const [openedDay, setOpenedDay] = useState<string | null>()

    useEffect(() => {
        if (openedDay) {
          recordingsStore.playedRecord.cameraName = camera.name
          const hostName = mapHostToHostname(host)
          recordingsStore.playedRecord.hostName = hostName
        }
      }, [openedDay])

    const handleClick = (value: string | null) => {
        setOpenedDay(value)
    }

    if (isPending) return (
        <Center>
            <Text>Loading...</Text>
        </Center>
    )
    if (isError) return <Text>Loading error</Text>

    if (!data || !camera) return null

    const days = data.map(rec => (
        <Accordion.Item key={rec.day} value={rec.day}>
            <Accordion.Control key={rec.day + 'control'}>{rec.day}</Accordion.Control>
            <Accordion.Panel key={rec.day + 'panel'}>
                <DayAccordion key={rec.day + 'day'} recordSummary={rec} />
            </Accordion.Panel>
        </Accordion.Item>

    ))
    return (
        <Accordion variant='separated' radius="md" w='100%' onChange={handleClick}>
            {days}
        </Accordion>
    )
})

export default CameraAccordion;
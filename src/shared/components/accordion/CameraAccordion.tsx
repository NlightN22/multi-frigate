import { Accordion, Center, Text } from '@mantine/core';
import React, { useContext, useEffect, useState } from 'react';
import { GetCameraWHostWConfig, GetFrigateHost } from '../../../services/frigate.proxy/frigate.schema';
import { useQuery } from '@tanstack/react-query';
import { frigateQueryKeys, mapHostToHostname, proxyApi } from '../../../services/frigate.proxy/frigate.api';
import DayAccordion from './DayAccordion';
import { observer } from 'mobx-react-lite';
import { Context } from '../../..';
import { getResolvedTimeZone } from '../frigate/dateUtil';

interface CameraAccordionProps {
    camera: GetCameraWHostWConfig,
    host: GetFrigateHost
}

const CameraAccordion = observer(({
    camera,
    host
}: CameraAccordionProps) => {
    const { recordingsStore: recStore } = useContext(Context)

    const { data, isPending, isError } = useQuery({
        queryKey: [frigateQueryKeys.getRecordingsSummary, camera?.id],
        queryFn: () => {
            if (camera && host) {
                const hostName = mapHostToHostname(host)
                return proxyApi.getRecordingsSummary(hostName, camera.name, getResolvedTimeZone())
            }
            return null
        }
    })

    const [openedDay, setOpenedDay] = useState<string | null>()

    useEffect(() => {
        if (openedDay) {
            recStore.recordToPlay.cameraName = camera.name
            const hostName = mapHostToHostname(host)
            recStore.recordToPlay.hostName = hostName
        }
    }, [openedDay])

    const handleClick = (value: string | null) => {
        setOpenedDay(value)
    }

    if (isPending) return <Center><Text>Loading...</Text></Center>
    if (isError) return <Center><Text>Loading error</Text></Center>

    if (!data || !camera) return null


    const days = data.slice(0, 2).map(rec => (
        <Accordion.Item key={rec.day} value={rec.day}>
            <Accordion.Control key={rec.day + 'control'}>{rec.day}</Accordion.Control>
            <Accordion.Panel key={rec.day + 'panel'}>
                <DayAccordion key={rec.day + 'day'} recordSummary={rec} />
            </Accordion.Panel>
        </Accordion.Item>

    ))

    console.log('CameraAccordion rendered')

    return (
        <Accordion variant='separated' radius="md" w='100%' onChange={handleClick}>
            {days}
        </Accordion>
    )
})

export default CameraAccordion;
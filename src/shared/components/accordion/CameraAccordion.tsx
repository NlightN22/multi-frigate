import { Accordion, Center, Loader, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Context } from '../../..';
import { frigateQueryKeys, mapHostToHostname, proxyApi } from '../../../services/frigate.proxy/frigate.api';
import { RecordSummary } from '../../../types/record';
import { isProduction } from '../../env.const';
import { getResolvedTimeZone, parseQueryDateToDate } from '../../utils/dateUtil';
import RetryError from '../RetryError';
import DayAccordion from './DayAccordion';
import { GetCameraWHostWConfig } from '../../../services/frigate.proxy/frigate.schema';

interface CameraAccordionProps {
    camera: GetCameraWHostWConfig
}

const CameraAccordion = ({
    camera
}: CameraAccordionProps) => {
    const { t } = useTranslation()
    const { recordingsStore: recStore } = useContext(Context)

    const host = recStore.filteredHost
    const hostName = mapHostToHostname(host)

    const { data: recordings, isPending, isError, refetch } = useQuery({
        queryKey: [frigateQueryKeys.getRecordingsSummary, camera?.id],
        queryFn: () => {
            if (camera && hostName) {
                return proxyApi.getRecordingsSummary(hostName, camera.name, getResolvedTimeZone())
            }
            return null
        }
    })

    const recodItem = (record: RecordSummary) => {
        if (host) {
            return (
                <Accordion.Item key={record.day} value={record.day}>
                    <Accordion.Control key={record.day + 'control'}>{t('day')}: {record.day}</Accordion.Control>
                    <Accordion.Panel key={record.day + 'panel'}>
                        <DayAccordion
                            host={host}
                            camera={camera}
                            key={record.day + 'day'}
                            recordSummary={record} />
                    </Accordion.Panel>
                </Accordion.Item>
            )
        }
    }

    const days = useMemo(() => {
        if (recordings && camera) {
            const [startDate, endDate] = recStore.selectedRange
            if (startDate && endDate) {
                return recordings
                    .filter(rec => {
                        const parsedRecDate = parseQueryDateToDate(rec.day)
                        if (parsedRecDate) {
                            return parsedRecDate >= startDate && parsedRecDate <= endDate
                        }
                        return false
                    })
                    .map(rec => recodItem(rec))
            }
            if ((startDate && endDate) || (!startDate && !endDate)) {
                return recordings.map(rec => recodItem(rec))
            }
        }
        return []
    }, [recordings, recStore.selectedRange])

    if (isPending) return <Center><Loader /></Center>
    if (isError) return <RetryError onRetry={refetch} />

    if (!recordings || !camera) return null

    if (!isProduction) console.log('camera', camera)
    if (!isProduction) console.log('data', recordings)
    if (!isProduction) console.log('hostName', hostName)
    if (!isProduction) console.log('CameraAccordion rendered')


    return (
        <Accordion variant='separated' radius="md" w='100%'>
            {days}
        </Accordion>
    )
}

export default observer(CameraAccordion);
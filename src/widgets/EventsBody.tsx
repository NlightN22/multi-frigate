import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { frigateApi, frigateQueryKeys } from '../services/frigate.proxy/frigate.api';
import EventsAccordion from '../shared/components/accordion/EventsAccordion';
import OverlayCogwheelLoader from '../shared/components/loaders/OverlayCogwheelLoader';
import RetryError from '../shared/components/RetryError';
import { dayTimeToUnixTime } from '../shared/utils/dateUtil';

interface EventsBodyProps {
    hostId: string,
    cameraId: string,
    period: [Date, Date],
    startTime?: string,
    endTime?: string,
}


const EventsBody: FC<EventsBodyProps> = ({
    hostId,
    cameraId,
    period,
    startTime,
    endTime,
}) => {

    const startTimeUnix = dayTimeToUnixTime(period[0], startTime ? startTime : '00:00')
    const endTimeUnix = dayTimeToUnixTime(period[1], endTime ? endTime : '23:59')

    const { data, isError, isPending, refetch } = useQuery({
        queryKey: [frigateQueryKeys.getCameraById, cameraId, frigateQueryKeys.getFrigateHost, hostId],
        queryFn: async () => {
            const host = await frigateApi.getHost(hostId)
            const camera = await frigateApi.getCameraById(cameraId)
            return { camera, host }
        }
    })

    if (isPending) return <OverlayCogwheelLoader />
    if (isError) return <RetryError onRetry={refetch} />
    if (!data) return null

    return (
        <EventsAccordion
            camera={data.camera}
            host={data.host}
            startTime={startTimeUnix}
            endTime={endTimeUnix}
        />
    )
};

export default observer(EventsBody);
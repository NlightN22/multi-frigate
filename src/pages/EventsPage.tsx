import { Flex, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle } from '@tabler/icons-react';
import { t } from 'i18next';
import { observer } from 'mobx-react-lite';
import { useContext, useEffect, useMemo } from 'react';
import { Context } from '..';
import { isStartBiggerThanEndTime } from '../shared/utils/dateUtil';
import EventsBody from '../widgets/EventsBody';
import EventsRightFilters from '../widgets/sidebars/EventsRightFilters';
import { SideBarContext } from '../widgets/sidebars/SideBarContext';
import { useLocation, useSearchParams } from 'react-router-dom';

export const eventsQueryParams = {
    hostId: 'hostId',
    cameraId: 'cameraId',
    startDate: 'startDate',
    endDate: 'endDate',
    startTime: 'startTime',
    endTime: 'endTime',
}

const EventsPage = () => {

    const [searchParams] = useSearchParams()

    const { setRightChildren } = useContext(SideBarContext)

    useEffect(() => {
        setRightChildren(<EventsRightFilters />)
        return () => setRightChildren(null)
    }, [])

    const { eventsStore } = useContext(Context)


    const { hostId, cameraId, period, startTime, endTime } = eventsStore.filters

    useEffect(() => {
        const paramHostId = searchParams.get(eventsQueryParams.hostId) || undefined
        const paramCameraId = searchParams.get(eventsQueryParams.cameraId) || undefined
        const paramStartDate = searchParams.get(eventsQueryParams.startDate) || undefined
        const paramEndDate = searchParams.get(eventsQueryParams.endDate) || undefined
        const paramStartTime = searchParams.get(eventsQueryParams.startTime) || undefined
        const paramEndTime = searchParams.get(eventsQueryParams.endTime) || undefined
        eventsStore.loadFiltersFromPage(paramHostId, paramCameraId, paramStartDate, paramEndDate, paramStartTime, paramEndTime)
    }, [searchParams])

    useEffect(() => {
        if (startTime && endTime) {
            if (isStartBiggerThanEndTime(startTime, endTime)) {
                const message = t('eventsPage.startTimeBiggerThanEnd')
                notifications.show({
                    id: message,
                    withCloseButton: true,
                    autoClose: 5000,
                    title: t('error'),
                    message: message,
                    color: 'red',
                    icon: <IconAlertCircle />,
                })
                return
            }
        }
    }, [startTime, endTime])

    if (hostId && cameraId && period && period[0] && period[1]) {
        return (
            <EventsBody
                hostId={hostId}
                cameraId={cameraId}
                period={[period[0], period[1]]}
                startTime={startTime}
                endTime={endTime}
            />
        )
    }

    return (
        <Flex w='100%' h='100%' direction='column' justify='center' align='center'>
            {!hostId ?
                <Text size='xl'>{t('pleaseSelectHost')}</Text>
                : <></>
            }
            {hostId && !cameraId ?
                <Text size='xl'>{t('pleaseSelectCamera')}</Text>
                : <></>
            }
            {hostId && cameraId && !eventsStore.isPeriodSet() ?
                <Text size='xl'>{t('pleaseSelectDate')}</Text>
                : <></>
            }
        </Flex>
    );
};


export default observer(EventsPage);
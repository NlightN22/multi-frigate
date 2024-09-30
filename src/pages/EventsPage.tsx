import { Flex, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { t } from 'i18next';
import { observer } from 'mobx-react-lite';
import { useContext, useEffect, useState } from 'react';
import { Context } from '..';
import { isStartBiggerThanEndTime } from '../shared/utils/dateUtil';
import EventsBody from '../widgets/EventsBody';
import EventsRightFilters from '../widgets/sidebars/EventsRightFilters';
import { SideBarContext } from '../widgets/sidebars/SideBarContext';
import { IconAlertCircle } from '@tabler/icons-react';

export const eventsPageQuery = {
    hostId: 'hostId',
    cameraId: 'cameraId',
    startDay: 'startDay',
    endDay: 'endDay',
    hour: 'hour',
}

interface TimePeriod  {
    startTime: string,
    endTime: string,
}

const EventsPage = () => {

    const [timePeriod, setTimePeriod] = useState<TimePeriod>()

    const { setRightChildren } = useContext(SideBarContext)

    useEffect(() => {
        setRightChildren(<EventsRightFilters />)
        return () => setRightChildren(null)
    }, [])



    const { eventsStore } = useContext(Context)
    const { hostId, cameraId, period, startTime, endTime } = eventsStore.filters

    useEffect(() => {
        const startTime = eventsStore.filters.startTime
        const endTime = eventsStore.filters.endTime
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
            setTimePeriod({
                startTime,
                endTime
            })
        }
    }, [eventsStore.filters.startTime, eventsStore.filters.endTime])

    if (hostId && cameraId && period && period[0] && period[1]) {
        return (
            <EventsBody
                hostId={hostId}
                cameraId={cameraId}
                period={[period[0], period[1]]}
                startTime={timePeriod?.startTime}
                endTime={timePeriod?.endTime}
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
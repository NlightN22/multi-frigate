import { Flex, Text } from '@mantine/core';
import { t } from 'i18next';
import { observer } from 'mobx-react-lite';
import { useContext, useEffect } from 'react';
import { Context } from '..';
import EventsBody from '../widgets/EventsBody';
import EventsRightFilters from '../widgets/sidebars/EventsRightFilters';
import { SideBarContext } from '../widgets/sidebars/SideBarContext';
import { isProduction } from '../shared/env.const';

export const eventsPageQuery = {
    hostId: 'hostId',
    cameraId: 'cameraId',
    startDay: 'startDay',
    endDay: 'endDay',
    hour: 'hour',
}

const EventsPage = () => {

    const { setRightChildren } = useContext(SideBarContext)

    useEffect(() => {
        setRightChildren(<EventsRightFilters />)
        return () => setRightChildren(null)
    }, [])

    const { eventsStore } = useContext(Context)
    const { hostId, cameraId, period, startTime, endTime } = eventsStore.filters

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
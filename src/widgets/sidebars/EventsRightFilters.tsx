import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Context } from '../..';
import CameraSelect from '../../shared/components/filters/CameraSelect';
import DateRangeSelect from '../../shared/components/filters/DateRangeSelect';
import HostSelect from '../../shared/components/filters/HostSelect';
import TimePicker from '../../shared/components/filters/TimePicker';
import { isProduction } from '../../shared/env.const';

const EventsRightFilters = () => {

    const { t } = useTranslation()

    const { eventsStore } = useContext(Context)
    const navigate = useNavigate()


    const handleHostSelect = (hostId: string) => {
        eventsStore.setHostId(hostId, navigate)
    }

    const handleCameraSelect = (cameraId: string) => {
        eventsStore.setCameraId(cameraId, navigate)
    }

    const handlePeriodSelect = (value: [Date | null, Date | null]) => {
        eventsStore.setPeriod(value, navigate)
        if (!isProduction) console.log('Selected period: ', value)
    }

    const handleSelectStartTime = (value: string) => {
        eventsStore.setStartTime(value, navigate)
        if (!isProduction) console.log('Selected start time: ', value)
    }

    const handleSelectEndTime = (value: string) => {
        eventsStore.setEndTime(value, navigate)
        if (!isProduction) console.log('Selected end time: ', value)
    }

    const validatedStartTime = () => {
        if (eventsStore.filters.startTime && eventsStore.filters.endTime) {
            if (eventsStore.filters.startTime > eventsStore.filters.endTime) {
                return eventsStore.filters.endTime
            }
        }
        return eventsStore.filters.startTime
    }

    return (
        <>
            <HostSelect
                label={t('selectHost')}
                valueId={eventsStore.filters.hostId}
                onChange={handleHostSelect}
            />
            {!eventsStore.filters.hostId ? null :
                <CameraSelect
                    label={t('selectCamera')}
                    hostId={eventsStore.filters.hostId}
                    valueId={eventsStore.filters.cameraId}
                    onChange={handleCameraSelect}
                />
            }
            {!eventsStore.filters.cameraId ? null :
                <DateRangeSelect
                    onChange={handlePeriodSelect}
                    value={eventsStore.filters.period}
                />
            }
            {!eventsStore.isPeriodSet() ? null :
                <>
                    <TimePicker
                        defaultValue={eventsStore.filters.startTime}
                        key='startTime'
                        label={t('eventsPage.selectStartTime')}
                        onChange={handleSelectStartTime}
                    />
                    <TimePicker
                        defaultValue={eventsStore.filters.endTime}
                        key='endTime'
                        label={t('eventsPage.selectEndTime')}
                        onChange={handleSelectEndTime}
                    />
                </>
            }
        </>
    )
}

export default observer(EventsRightFilters);
import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../..';
import CameraSelectFilter from '../../shared/components/filters/CameraSelectFilter';
import DateRangeSelectFilter from '../../shared/components/filters/DateRangeSelect';
import RecordingsHostFilter from '../../shared/components/filters/RecordingsHostFilter';
import { isProduction } from '../../shared/env.const';

const RecordingsFiltersRightSide = () => {
    const { recordingsStore: recStore } = useContext(Context)

    if (!isProduction) console.log('RecordingsFiltersRightSide rendered')

    const handleDatePick = (value: [Date | null, Date | null]) => {
        recStore.selectedRange = value
    }
    return (
        <>
            <RecordingsHostFilter />
            {recStore.filteredHost ?
                <CameraSelectFilter
                    selectedHostId={recStore.filteredHost.id} />
                : <></>
            }
            {recStore.filteredCamera ?
                <DateRangeSelectFilter 
                onChange={handleDatePick}
                value={recStore.selectedRange}
                />
                : <></>
            }
        </>

    )
}

export default observer(RecordingsFiltersRightSide);
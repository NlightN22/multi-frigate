import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '..';
import CameraSelectFilter from '../shared/components/filters/CameraSelectFilter';
import DateRangeSelectFilter from '../shared/components/filters/DateRangeSelectFilter';
import RecordingsHostFilter from '../shared/components/filters/RecordingsHostFilter';
import { isProduction } from '../shared/env.const';

const RecordingsFiltersRightSide = () => {
    const { recordingsStore: recStore } = useContext(Context)

    if (!isProduction) console.log('RecordingsFiltersRightSide rendered')
    return (
        <>
            <RecordingsHostFilter />
            {recStore.filteredHost ?
                <CameraSelectFilter 
                selectedHostId={recStore.filteredHost.id} />
                : <></>
            }
            {recStore.filteredCamera ?
                <DateRangeSelectFilter />
                : <></>
            }
        </>

    )
}

export default observer(RecordingsFiltersRightSide);
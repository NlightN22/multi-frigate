import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '..';
import CameraSelectFilter from '../shared/components/filters.aps/CameraSelectFilter';
import DateRangeSelectFilter from '../shared/components/filters.aps/DateRangeSelectFilter';
import HostSelectFilter from '../shared/components/filters.aps/HostSelectFilter';
import { isProduction } from '../shared/env.const';

const RecordingsFiltersRightSide = () => {
    const { recordingsStore: recStore } = useContext(Context)

    if (!isProduction) console.log('RecordingsFiltersRightSide rendered')
    return (
        <>
            <HostSelectFilter />
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
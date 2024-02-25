import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '..';
import CameraSelectFilter from '../shared/components/filters.aps/CameraSelectFilter';
import DateRangeSelectFilter from '../shared/components/filters.aps/DateRangeSelectFilter';
import HostSelectFilter from '../shared/components/filters.aps/HostSelectFilter';

interface RecordingsFiltersRightSideProps {
}

const RecordingsFiltersRightSide = ({
}: RecordingsFiltersRightSideProps) => {
    const { recordingsStore: recStore } = useContext(Context)

    console.log('RecordingsFiltersRightSide rendered')
    return (
        <>
            <HostSelectFilter />
            {recStore.selectedHost ?
                <CameraSelectFilter 
                selectedHostId={recStore.selectedHost.id} />
                : <></>
            }
            {recStore.selectedCamera ?
                <DateRangeSelectFilter />
                : <></>
            }
        </>

    )
}

export default observer(RecordingsFiltersRightSide);
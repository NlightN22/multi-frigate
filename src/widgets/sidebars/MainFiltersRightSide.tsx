import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Context } from '../..';
import HostSelect from '../../shared/components/filters/HostSelect';
import { isProduction } from '../../shared/env.const';



const MainFiltersRightSide = () => {
    const { t } = useTranslation()

    const { mainStore } = useContext(Context)
    const { selectedHostId } = mainStore

    const handleSelect = (value: string) => {
        if (!isProduction) console.log('handleSelect value', value)
        mainStore.selectedHostId = value
    }

    return (
        <>
            <HostSelect
                label={t('selectHost')}
                valueId={selectedHostId}
                defaultId={selectedHostId}
                onChange={handleSelect}
            />
            {/* TODO Add tags select */}
            {/* <CreatableMultiSelect
                label={t('mainPage.createSelectTags')}
                spaceBetween='1rem'
                data={[]}
            /> */}
        </>
    );
};



export default observer(MainFiltersRightSide);
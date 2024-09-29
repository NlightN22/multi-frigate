import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Context } from '../..';
import HostSelect from '../../shared/components/filters/HostSelect';
import UserTagsFilter from '../../shared/components/filters/UserTagsFilter';
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

            <UserTagsFilter />

        </>
    );
};

export default observer(MainFiltersRightSide);
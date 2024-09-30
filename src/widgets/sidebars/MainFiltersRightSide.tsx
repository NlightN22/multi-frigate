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

    const handleSelectHost = (value: string) => {
        if (!isProduction) console.log('handleSelectHost value', value)
        mainStore.selectedHostId = value
    }

    const handleSelectTags = (tags: string[]) => {
        if (!isProduction) console.log('handleSelectTags value', tags)
            mainStore.selectedTags = tags
    }

    return (
        <>
            <HostSelect
                label={t('selectHost')}
                valueId={selectedHostId}
                defaultId={selectedHostId}
                onChange={handleSelectHost}
            />

            <UserTagsFilter 
                onChange={handleSelectTags}
            />

        </>
    );
};

export default observer(MainFiltersRightSide);
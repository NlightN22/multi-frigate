import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Context } from '../..';
import HostSelect from '../../shared/components/filters/HostSelect';
import UserTagsFilter from '../../shared/components/filters/UserTagsFilter';
import { isProduction } from '../../shared/env.const';
import { useNavigate } from 'react-router-dom';


const MainFiltersRightSide = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const { mainStore } = useContext(Context)
    const { hostId } = mainStore.filters

    const handleSelectHost = (value: string) => {
        if (!isProduction) console.log('handleSelectHost value', value)
        mainStore.setHostId(value, navigate)
    }

    const handleSelectTags = (tags: string[]) => {
        if (!isProduction) console.log('handleSelectTags value', tags)
        mainStore.setSelectedTags(tags, navigate)
    }

    return (
        <>
            <HostSelect
                label={t('selectHost')}
                valueId={hostId || undefined}
                defaultId={hostId || undefined}
                onChange={handleSelectHost}
            />

            <UserTagsFilter
                onChange={handleSelectTags}
            />

        </>
    );
};

export default observer(MainFiltersRightSide);
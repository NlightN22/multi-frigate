import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Context } from '../../..';
import { frigateApi, frigateQueryKeys } from '../../../services/frigate.proxy/frigate.api';
import HostSelect from './HostSelect';
import { useTranslation } from 'react-i18next';

const RecordingsHostFilter = () => {
    const { t } = useTranslation()
    const { recordingsStore: recStore } = useContext(Context)

    const { data: hosts } = useQuery({
        queryKey: [frigateQueryKeys.getFrigateHosts],
        queryFn: frigateApi.getHosts
    })


    const handleSelect = (value: string) => {
        const host = hosts?.find(host => host.id === value)
        if (!host) {
            recStore.filteredHost = undefined
            recStore.filteredCamera = undefined
            return
        }
        if (recStore.filteredHost?.id !== host.id) {
            recStore.filteredCamera = undefined
        }
        recStore.filteredHost = host
    }

    const handleSuccess = () => {
        if (!hosts) return
        if (recStore.hostIdParam) {
            recStore.filteredHost = hosts.find(host => host.id === recStore.hostIdParam)
            recStore.hostIdParam = undefined
        }
    }

    return (
        <HostSelect
        label={t('selectHost')}
        valueId={recStore.filteredHost?.id}
        defaultId={recStore.filteredHost?.id}
        onChange={handleSelect}
        onSuccess={handleSuccess}
        />
    );
};

export default observer(RecordingsHostFilter);
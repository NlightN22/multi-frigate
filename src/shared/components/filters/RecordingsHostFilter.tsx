import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Context } from '../../..';
import { frigateApi, frigateQueryKeys } from '../../../services/frigate.proxy/frigate.api';
import { strings } from '../../strings/strings';
import HostSelect from './HostSelect';

const RecordingsHostFilter = () => {
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
        label={strings.selectHost}
        valueId={recStore.filteredHost?.id}
        defaultId={recStore.filteredHost?.id}
        onChange={handleSelect}
        onSuccess={handleSuccess}
        />
    );
};

export default observer(RecordingsHostFilter);
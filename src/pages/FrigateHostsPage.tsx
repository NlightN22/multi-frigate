import React from 'react';
import FrigateHostsTable from '../widgets/FrigateHostsTable';
import { useQuery } from '@tanstack/react-query';
import { frigateApi } from '../services/frigate.proxy/frigate.api';
import CenterLoader from '../shared/components/CenterLoader';
import RetryError from './RetryError';

const FrigateHostsPage = () => {

    const { isPending: hostsPending, error: hostsError, data, refetch } = useQuery({
        queryKey: ['frigate-hosts'],
        queryFn: frigateApi.getHosts,
    })

    if (hostsPending) return <CenterLoader />

    if (hostsError) return <RetryError />

    return (
        <div>
            <FrigateHostsTable data={data} showAddButton/>
        </div>
    );
};

export default FrigateHostsPage;
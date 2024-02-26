import { Flex, Paper } from '@mantine/core';
import { IconPower } from '@tabler/icons-react';
import React from 'react';
import { frigateApi, frigateQueryKeys } from '../../services/frigate.proxy/frigate.api';
import { useQuery } from '@tanstack/react-query';

interface StateCellProps {
    id?: string
    width?: string,
}
const StateCell = ({
    id,
    width,
}: StateCellProps) => {
    const { isPending, isError, data } = useQuery({
        queryKey: [frigateQueryKeys.getFrigateHosts, id],
        queryFn: frigateApi.getHosts,
        staleTime: 60 * 1000,
        gcTime: Infinity,
        refetchInterval: 30 * 1000,
    })

    const state = data?.find(host => host.id === id)?.state

    return (
        <td style={{ width: width }}>
            <Flex w='100%' justify='center'>
            <IconPower color={state ? 'green' : 'red'}/>
            </Flex>
        </td>
    );
};

export default StateCell;
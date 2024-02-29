import { Flex } from '@mantine/core';
import { IconPower } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { frigateApi, frigateQueryKeys } from '../../services/frigate.proxy/frigate.api';

interface StateCellProps {
    id?: string
    width?: string,
}
const StateCell = ({
    id,
    width,
}: StateCellProps) => {
    const { data } = useQuery({
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
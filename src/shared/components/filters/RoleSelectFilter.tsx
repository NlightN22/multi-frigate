import { Select, SelectProps } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { frigateApi, frigateQueryKeys } from '../../../services/frigate.proxy/frigate.api';
import RetryError from '../RetryError';
import CenteredCogwheelLoader from '../loaders/CenteredCogwheelLoader';
import { OneSelectItem } from './OneSelectFilter';

interface RoleSelectFilterProps extends Omit<SelectProps, 'data'> {
    onChange?: (roleId: string) => void
}

const RoleSelectFilter: React.FC<RoleSelectFilterProps> = ({
    onChange,
    ...selectProps
}) => {
    const [roleId, setRoleId] = useState<string>()

    const { data, isPending, isError, refetch } = useQuery({
        queryKey: [frigateQueryKeys.getRoles],
        queryFn: frigateApi.getRoles
    })

    if (isPending) return <CenteredCogwheelLoader />
    if (isError || !data) return <RetryError onRetry={refetch} />

    const rolesSelect: OneSelectItem[] = data.map(role => ({ value: role.id, label: role.name }))

    const handleSelectRole = (value: string) => {
        if (onChange) onChange(value)
        setRoleId(value)
    }

    return (
        <Select
            value={roleId}
            {...selectProps}
            data={rolesSelect}
            onChange={handleSelectRole}
        />
    );
};

export default RoleSelectFilter;
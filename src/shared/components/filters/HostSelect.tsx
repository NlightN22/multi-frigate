import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { frigateQueryKeys, frigateApi } from '../../../services/frigate.proxy/frigate.api';
import RetryError from '../RetryError';
import CogwheelLoader from '../loaders/CogwheelLoader';
import OneSelectFilter, { OneSelectItem } from './OneSelectFilter';
import { SystemProp, SpacingValue, MantineStyleSystemProps, Loader, Center } from '@mantine/core';

interface HostSelectProps extends MantineStyleSystemProps {
    label?: string
    valueId?: string
    defaultId?: string
    spaceBetween?: SystemProp<SpacingValue>
    placeholder?: string
    onChange?: (value: string) => void
    onSuccess?: () => void
}

const HostSelect = ({
    label,
    valueId,
    defaultId,
    spaceBetween,
    placeholder,
    onChange,
    onSuccess,
    ...styleProps
}: HostSelectProps) => {
    const { data: hosts, isError, isPending, isSuccess, refetch } = useQuery({
        queryKey: [frigateQueryKeys.getFrigateHosts],
        queryFn: frigateApi.getHosts
    })

    useEffect(() => {
        if (onSuccess) onSuccess()
    }, [isSuccess])

    if (isPending) return <Center><Loader /></Center>
    if (isError) return <RetryError onRetry={refetch} />

    if (!hosts || hosts.length < 1) return null

    const hostItems: OneSelectItem[] = hosts
        .filter(host => host.enabled)
        .map(host => ({ value: host.id, label: host.name }))

    const handleSelect = (value: string) => {
        if (onChange) onChange(value)
    }

    return (
        <OneSelectFilter
            id='frigate-hosts'
            label={label}
            placeholder={placeholder}
            spaceBetween={spaceBetween ? spaceBetween : '1rem'}
            value={valueId || ''}
            defaultValue={defaultId || ''}
            data={hostItems}
            onChange={handleSelect}
            {...styleProps}
        />
    );
};

export default HostSelect;
import { Loader, MantineStyleSystemProps, SpacingValue, SystemProp } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { FC, useEffect } from 'react';
import { frigateApi, frigateQueryKeys } from '../../../services/frigate.proxy/frigate.api';
import RetryError from '../RetryError';
import OneSelectFilter, { OneSelectItem } from './OneSelectFilter';


interface CameraSelectProps extends MantineStyleSystemProps {
    hostId: string
    label?: string
    valueId?: string
    defaultId?: string
    spaceBetween?: SystemProp<SpacingValue>
    placeholder?: string
    onChange?: (value: string) => void
    onSuccess?: () => void
}

const CameraSelect: FC<CameraSelectProps> = ({
    hostId,
    label,
    valueId,
    defaultId,
    spaceBetween,
    placeholder,
    onChange,
    onSuccess,
    ...styleProps
}) => {

    const { data, isError, isPending, isSuccess, refetch } = useQuery({
        queryKey: [frigateQueryKeys.getCameraByHostId, hostId],
        queryFn: () => frigateApi.getCamerasByHostId(hostId)
    })

    useEffect(() => {
        if (onSuccess) onSuccess()
    }, [isSuccess])

    if (isPending) return <Loader />
    if (isError) return <RetryError onRetry={refetch} />
    if (!data) return null

    const camerasItems: OneSelectItem[] = data.map(camera => ({ value: camera.id, label: camera.name }))

    const handleSelect = (value: string) => {
        if (onChange) onChange(value)
    }

    return (
        <OneSelectFilter
            id='frigate-cameras'
            label={label}
            spaceBetween='1rem'
            value={valueId || ''}
            defaultValue={defaultId || ''}
            data={camerasItems}
            onChange={handleSelect}
            {...styleProps}
        />
    );
};

export default CameraSelect;
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect } from 'react';
import { Context } from '../../..';
import { useQuery } from '@tanstack/react-query';
import { frigateApi, frigateQueryKeys } from '../../../services/frigate.proxy/frigate.api';
import CogwheelLoader from '../CogwheelLoader';
import { Center, Text } from '@mantine/core';
import OneSelectFilter, { OneSelectItem } from './OneSelectFilter';

interface CameraSelectFilterProps {
    selectedHostId: string,
}

const CameraSelectFilter = ({
    selectedHostId,
}: CameraSelectFilterProps) => {
    const { recordingsStore: recStore } = useContext(Context)

    const { data, isError, isPending, isSuccess } = useQuery({
        queryKey: [frigateQueryKeys.getFrigateHost, selectedHostId],
        queryFn: () => frigateApi.getHost(selectedHostId)
    })

    useEffect(() => { 
        if (!data) return
        if (recStore.cameraIdParam) {
            console.log('change camera by param')
            recStore.selectedCamera = data.cameras.find( camera => camera.id === recStore.cameraIdParam)
            recStore.cameraIdParam = undefined
        }
    }, [isSuccess])

    if (isPending) return <CogwheelLoader />
    if (isError) return <Center><Text>Loading error!</Text></Center>
    if (!data) return null

    const camerasItems: OneSelectItem[] = data.cameras.map(camera => ({ value: camera.id, label: camera.name }))

    const handleSelect = (id: string, value: string) => {
        const camera = data.cameras.find(camera => camera.id === value)
        if (!camera) {
            recStore.selectedCamera = undefined
            return
        }
        recStore.selectedCamera = camera
    }

    console.log('CameraSelectFilter rendered')
    // console.log('recStore.selectedCameraId', recStore.selectedCameraId)

    return (
        <OneSelectFilter
            id='frigate-cameras'
            label='Select camera:'
            spaceBetween='1rem'
            value={recStore.selectedCamera?.id || ''}
            defaultValue={recStore.selectedCamera?.id || ''}
            data={camerasItems}
            onChange={handleSelect}
        />
    );
};

export default observer(CameraSelectFilter);
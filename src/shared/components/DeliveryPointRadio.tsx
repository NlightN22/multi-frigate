import { Radio, Group } from '@mantine/core';
import React from 'react';
import { strings } from '../strings/strings';
import { it } from 'node:test';
import { DeliveryPoint } from '../stores/user.store';

interface DeliveryPointRadioProps {
    data: DeliveryItem[],
    currentPoint?: DeliveryPoint,
    onChange(pointId: string): void,
    error?: string
}

interface DeliveryItem {
    id: string,
    name: string,
}

const DeliveryPointRadio = ( {data, currentPoint, onChange, error}:DeliveryPointRadioProps ) => {

    const radios = data.map( item => (
        <Radio key={item.id} value={item.id} label={item.name} />
    ))

    return (
        <Radio.Group
            size='lg'
            name="deliveryPoints"
            label={strings.deliveryPoint}
            description={strings.selectYourDeliveryAddress}
            withAsterisk
            onChange={onChange}
            defaultValue={currentPoint?.id}
            error={error}
        >
            <Group mt="lg">
                {radios}
            </Group>
        </Radio.Group>
    );
};

export default DeliveryPointRadio;
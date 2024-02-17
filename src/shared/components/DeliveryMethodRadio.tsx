import React from 'react';
import { DeliveryMethods, DeliveryMethod } from '../stores/orders.store';
import { Radio, Group } from '@mantine/core';
import { strings } from '../strings/strings';

interface DeliveryMethodRadioProps {
    deliveryAvailable: boolean
    onChange(value: string): void
    deliveryMethod?: DeliveryMethod
    error?: string
}

const DeliveryMethodRadio = ( {deliveryAvailable, deliveryMethod, onChange, error}: DeliveryMethodRadioProps ) => {

    return (
        <Radio.Group
            size='lg'
            name="deliveryMethod"
            label={strings.delivery}
            description={strings.selectDeliveryMethod}
            withAsterisk
            onChange={onChange}
            value={deliveryMethod}
            error={error}
        >
            <Group mt="lg">
                {deliveryAvailable ? 
                <Radio value={DeliveryMethods.Enum.delivery} label={strings.courierDelivery} />
                : <></>
                }
                <Radio value={DeliveryMethods.Enum.pickup} label={strings.pickUpByMyself} />
            </Group>
        </Radio.Group>
    );
};

export default DeliveryMethodRadio;
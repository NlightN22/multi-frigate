import { Radio, Group } from '@mantine/core';
import React from 'react';
import { strings } from '../strings/strings';
import { PaymentMethod, PaymentMethods } from '../stores/orders.store';

interface PaymentMehodRadioProps {
    onChange(value: PaymentMethod): void
    currentValue?: PaymentMethod
    error?: string
}

const PaymentMehodRadio = ( {onChange, currentValue, error}: PaymentMehodRadioProps) => {

    return (
        <Radio.Group
            size='lg'
            name="paymentMethod"
            label={strings.paymentMethod}
            description={strings.selectPaymentMethod}
            withAsterisk
            onChange={onChange}
            value={currentValue}
            error={error}
        >
            <Group mt="lg">
                <Radio value={PaymentMethods.Enum.Cash} label={strings.cashToCourier} />
                <Radio value={PaymentMethods.Enum.BankTransfer} label={strings.bankTransfer} />
                <Radio value={PaymentMethods.Enum.Online} label={strings.onlineByCard} />
            </Group>
        </Radio.Group>
    );
};

export default PaymentMehodRadio;
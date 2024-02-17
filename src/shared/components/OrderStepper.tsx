import { Flex, Stepper } from '@mantine/core';
import { useContext, useEffect, useState } from 'react';
import { strings } from '../strings/strings';
import { Context } from '../..';
import { observer } from 'mobx-react-lite';
import { PaymentMethod, PaymentMethods } from '../stores/orders.store';

const OrderStepper = observer(() => {

    const { sideBarsStore, cartStore } = useContext(Context)

    const { confirmedStage, paymentMethod } = cartStore

    const stage = confirmedStage ? confirmedStage.stage + 1 : 0

    const pb = '5rem'
    return (
        <Flex direction='column' justify='center' h='100%'>
            <Stepper
                h='20rem'
                active={stage}
                orientation="vertical"
                allowNextStepsSelect={false}
            >
                <Stepper.Step pb={pb} label={strings.cart} description={strings.confirmOrder} />
                <Stepper.Step pb={pb} label={strings.orderParams} description={strings.chooseParams} />
                {paymentMethod.data === PaymentMethods.Enum.Online ?
                    <Stepper.Step pb={pb} label={strings.payment} description={strings.inputPaymentValues} />
                    : <></>
                }
            </Stepper>
        </Flex>
    )
})

export default OrderStepper;
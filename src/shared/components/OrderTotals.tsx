import { Button, Divider, Flex, Text } from '@mantine/core';
import React, { useContext, useEffect } from 'react';
import PriceText from './PriceText';
import Currency from './Currency';
import { strings } from '../strings/strings';
import { Context } from '../..';
import { useNavigate } from 'react-router-dom';

const OrderTotals = () => {
    const navigate = useNavigate()
    const { cartStore } = useContext(Context)
    const { isLoading, products, totalWeight, totalSum,
        currentStage, confirmStage, confirmedStage, CartStages } = cartStore

    const sizeBetween = '0.5rem'

    const handleConfirm = () => {
        const maxIndex = cartStore.CartStages.length - 1
        const validate = confirmStage(currentStage)
        if (currentStage.stage === maxIndex) {
            console.log("currentStage.stage === maxIndex")
            return
            if (validate) {
                // todo send to server
                // navigate to main
            }
        }
        if (currentStage.stage < maxIndex) {
            const nextStageIndex = currentStage.stage + 1
            console.log("navigate")
            if (validate) {
                navigate(cartStore.CartStages[nextStageIndex].path)
            }
        }
    }

    const backButton = () => {
        if (currentStage.stage === 0) {
            return <></>
        }
        return <Button onClick={() => navigate(-1)}>{strings.back}</Button>
    }

    const okButton = () => {
        const lastStageIndex = CartStages.length - 1
        if (confirmedStage?.stage === CartStages[lastStageIndex].stage) {
            return <></>
        }
        return (
            <Button onClick={handleConfirm} mb={sizeBetween}>{strings.confirm}</Button>
        )
    }

    return (
        <Flex direction='column' h='100%' justify='center' align='center' gap='0.2rem'>
            <Text weight={700}>{strings.summary}</Text>
            <Divider pb={sizeBetween} w='100%' />
            <Text >{strings.positions}</Text>
            <Text>{products.length}</Text>
            <Divider pb={sizeBetween} w='100%' />
            <Text>{strings.weight}</Text>
            <Text >{totalWeight}</Text>
            <Divider pb={sizeBetween} w='100%' />
            <Text tt="uppercase">{strings.total}</Text>
            <Flex pb={sizeBetween}><PriceText value={totalSum} /><Currency /></Flex>
            <Divider pb={sizeBetween} w='100%' />
            {okButton()}
            {backButton()}
        </Flex>
    );
};

export default OrderTotals;
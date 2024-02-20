import { Button, Flex, Text } from '@mantine/core';
import React, { useContext, useEffect, useState } from 'react';
import CogWheelWithText from '../shared/components/CogWheelWithText';
import { strings } from '../shared/strings/strings';
import { redirect, useNavigate } from 'react-router-dom';
import { routesPath } from '../router/routes.path';
import { Context } from '..';

const Forbidden = () => {

    const { sideBarsStore } = useContext(Context)

    useEffect(() => {
        sideBarsStore.setLeftChildren(null)
        sideBarsStore.setRightChildren(null)
    }, [])

    const handleGoToMain = () => {
        window.location.replace(routesPath.MAIN_PATH)
    }

    return (
        <Flex h='100%' direction='column' justify='center' align='center' gap='1rem'>
            <Text fz='lg' fw={700}>{strings.errors[403]}</Text>
            <CogWheelWithText text='403' />
            <Button onClick={handleGoToMain}>{strings.goToMainPage}</Button>
        </Flex>

    );
};

export default Forbidden;
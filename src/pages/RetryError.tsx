import { Flex, Button, Text } from '@mantine/core';
import React, { useContext, useEffect } from 'react';
import { routesPath } from '../router/routes.path';
import { strings } from '../shared/strings/strings';
import { useNavigate } from 'react-router-dom';
import { ExclamationCogWheel } from '../shared/components/svg/ExclamationCogWheel';
import { Context } from '..';

interface RetryErrorProps {
    onRetry?: () => void
}

const RetryError = ( {onRetry} : RetryErrorProps) => {
    const navigate = useNavigate()

    const { sideBarsStore } = useContext(Context)


    useEffect(() => {
        sideBarsStore.setLeftChildren(null)
        sideBarsStore.setRightChildren(null)
    }, [])

    const handleGoToMain = () => {
        navigate(routesPath.MAIN_PATH)
    }

    function handleRetry(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        if (onRetry) onRetry()
        else window.location.reload()
    }

    return (
        <Flex h='100%' direction='column' justify='center' align='center' gap='1rem'>
            <Text fz='lg' fw={700}>{strings.errors.somthengGoesWrong}</Text>
            {ExclamationCogWheel}
            <Text fz='lg' fw={700}>{strings.youCanRetryOrGoToMain}</Text>
            <Button onClick={handleRetry}>{strings.retry}</Button>
            <Button onClick={handleGoToMain}>{strings.goToMainPage}</Button>
        </Flex>
    );
};

export default RetryError;
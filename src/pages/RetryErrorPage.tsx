import { Flex, Button, Text } from '@mantine/core';
import React, { useContext, useEffect, useRef } from 'react';
import { routesPath } from '../router/routes.path';
import { strings } from '../shared/strings/strings';
import { useNavigate } from 'react-router-dom';
import { ExclamationCogWheel } from '../shared/components/svg/ExclamationCogWheel';
import { Context } from '..';
import { observer } from 'mobx-react-lite';

interface RetryErrorPageProps {
    repeatVisible?: boolean
    backVisible?: boolean
    mainVisible?: boolean
    onRetry?: () => void
}

const RetryErrorPage = ({
    repeatVisible = true,
    backVisible = true,
    mainVisible = true,
    onRetry
}: RetryErrorPageProps) => {
    const executed = useRef(false)

    const navigate = useNavigate()

    const { sideBarsStore } = useContext(Context)
    useEffect(() => {
        if (!executed.current) {
            sideBarsStore.rightVisible = false
            sideBarsStore.setLeftChildren(null)
            sideBarsStore.setRightChildren(null)
            executed.current = true
        }
    }, [sideBarsStore])

    const handleGoToMain = () => {
        navigate(routesPath.MAIN_PATH)
    }

    const handleGoBack = () => {
        navigate(-1)
    }

    const handleRetry = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        if (onRetry) onRetry()
        else window.location.reload()
    }

    return (
        <Flex h='100%' direction='column' justify='center' align='center' gap='1rem'>
            <Text fz='lg' fw={700}>{strings.errors.somthengGoesWrong}</Text>
            {ExclamationCogWheel}
            <Text fz='lg' fw={700}>{strings.youCanRetryOrGoToMain}</Text>
            <Flex>
                {repeatVisible ? <Button ml='1rem' onClick={handleRetry}>{strings.retry}</Button> : null}
                { backVisible ? <Button ml='1rem' onClick={handleGoBack}>{strings.back}</Button> : null }
                { mainVisible ? <Button ml='1rem' onClick={handleGoToMain}>{strings.goToMainPage}</Button> : null }
            </Flex>
        </Flex>
    );
};

export default observer(RetryErrorPage);
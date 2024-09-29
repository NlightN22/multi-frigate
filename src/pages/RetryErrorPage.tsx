import { Button, Flex, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { routesPath } from '../router/routes.path';
import { ExclamationCogWheel } from '../shared/components/svg/ExclamationCogWheel';

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
    const { t } = useTranslation()

    const navigate = useNavigate()

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
            <Text fz='lg' fw={700}>{t('errors.somthingGoesWrong')}</Text>
            {ExclamationCogWheel}
            <Text fz='lg' fw={700}>{t('youCanRetryOrGoToMain')}</Text>
            <Flex>
                {repeatVisible ? <Button ml='1rem' onClick={handleRetry}>{t('retry')}</Button> : null}
                { backVisible ? <Button ml='1rem' onClick={handleGoBack}>{t('back')}</Button> : null }
                { mainVisible ? <Button ml='1rem' onClick={handleGoToMain}>{t('goToMainPage')}</Button> : null }
            </Flex>
        </Flex>
    );
};

export default observer(RetryErrorPage);
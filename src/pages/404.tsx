import { Button, Flex, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { routesPath } from '../router/routes.path';
import CogWheelWithText from '../shared/components/loaders/CogWheelWithText';

const NotFound = () => {
    const { t } = useTranslation()

    const handleGoToMain = () => {
        window.location.replace(routesPath.MAIN_PATH)
    }

    return (
        <Flex h='100%' direction='column' justify='center' align='center' gap='1rem'>
            <Text fz='lg' fw={700}>{t('errors.404')}</Text>
            <CogWheelWithText text='404' />
            <Button onClick={handleGoToMain}>{t('goToMainPage')}</Button>
        </Flex>

    );
};

export default observer(NotFound);
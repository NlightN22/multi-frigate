import { Button, Flex, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useContext, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Context } from '..';
import { routesPath } from '../router/routes.path';
import CogWheelWithText from '../shared/components/loaders/CogWheelWithText';

const Forbidden = () => {
    const { t } = useTranslation()
    const executed = useRef(false)
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
        window.location.replace(routesPath.MAIN_PATH)
    }

    return (
        <Flex h='100%' direction='column' justify='center' align='center' gap='1rem'>
            <Text fz='lg' fw={700}>{t('errors.403')}</Text>
            <CogWheelWithText text='403' />
            <Button onClick={handleGoToMain}>{t('goToMainPage')}</Button>
        </Flex>

    );
};

export default observer(Forbidden);
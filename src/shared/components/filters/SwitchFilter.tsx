import { Box, Flex, SpacingValue, Switch, SystemProp, Text } from '@mantine/core';
import { CSSProperties, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import CloseWithTooltip from '../buttons/CloseWithTooltip';

interface SwitchFilterProps {
    id: string
    value?: boolean,
    defaultValue?: boolean,
    spaceBetween?: SystemProp<SpacingValue>
    label?: string
    textClassName?: string
    display?: SystemProp<CSSProperties['display']>
    showClose?: boolean
    changedState?(id: string, value: boolean): void
    onClose?(): void
}

export interface SwitchChangeState {
    itemId: string,
    value: boolean
}

const SwitchFilter = ({ id, value, defaultValue, spaceBetween, label, textClassName, display, showClose, changedState, onClose }: SwitchFilterProps) => {
    const { t } = useTranslation()
    const handleChange = (event: ChangeEvent<HTMLInputElement> | undefined) => {
        const checked = event?.currentTarget.checked
        if (changedState && typeof checked === 'boolean') {
            changedState(id, checked)
        }

    }
    return (
        <Box display={display} mt={spaceBetween}>
            <Flex align='center' w='100%'>
                <Text className={textClassName}>{label}</Text>
                <Switch onChange={handleChange} checked={value} defaultChecked={defaultValue} ml='lg' mr='md' />
                {showClose ? <CloseWithTooltip label={t('hide')} onClose={onClose} /> : null}
            </Flex>
        </Box>
    );
};

export default SwitchFilter;
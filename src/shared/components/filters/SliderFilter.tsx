import { Box, Flex, Slider, SliderProps, SpacingValue, SystemProp, Text } from '@mantine/core';
import { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import CloseWithTooltip from '../buttons/CloseWithTooltip';

interface SliderFilterProps {
    id: string
    min: number
    max: number
    value?: number
    spaceBetween?: SystemProp<SpacingValue>
    label?: string
    defaultValue?: number
    textClassName?: string
    sliderProps?: SliderProps,
    display?: SystemProp<CSSProperties['display']>
    showClose?: boolean,
    changedState?(id: string, value: number): void
    onClose?(): void
}

const SliderFilter = ({ id, min, max, value, spaceBetween, label, defaultValue, textClassName, sliderProps, display, showClose, changedState, onClose }: SliderFilterProps) => {

    const { t } = useTranslation()

    const handleOnChange = (value: number) => {
        if (changedState) {
            changedState(id, value)
        }
    }

    return (
        <Box display={display} mt={spaceBetween}>
            <Flex justify='space-between'>
                <Text className={textClassName}>{label}</Text>
                {showClose ? <CloseWithTooltip label={t('hide')} onClose={onClose} /> : null}
            </Flex>
            <Slider {...sliderProps}
                onChangeEnd={handleOnChange}
                value={value}
                min={min}
                max={max}
                defaultValue={defaultValue}
                pl='1rem' mt='0.5rem' />
        </Box>
    );
};

export default SliderFilter;
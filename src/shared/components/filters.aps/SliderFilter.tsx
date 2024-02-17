import { Box, CloseButton, Flex, Slider, SliderProps, SpacingValue, SystemProp, Text } from '@mantine/core';
import React, { CSSProperties, useState, } from 'react';
import CloseWithTooltip from '../CloseWithTooltip';
import { strings } from '../../strings/strings';

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
    onClose?():void
}

const SliderFilter = ({ id, min, max, value, spaceBetween, label, defaultValue, textClassName, sliderProps, display, showClose, changedState, onClose }: SliderFilterProps) => {


    const handleOnChange = (value: number) => {
        if (changedState) {
            changedState(id, value)
        }
    }

    return (
        <Box display={display} mt={spaceBetween}>
            <Flex justify='space-between'>
                <Text className={textClassName}>{label}</Text>
                {showClose ? <CloseWithTooltip label={strings.hide} onClose={onClose} />  : null}
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
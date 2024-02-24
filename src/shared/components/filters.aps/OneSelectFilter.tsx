import { SelectItem, SystemProp, SpacingValue, SelectProps, Box, Flex, CloseButton, Text, Select } from '@mantine/core';
import React, { CSSProperties } from 'react';
import CloseWithTooltip from '../CloseWithTooltip';
import { strings } from '../../strings/strings';


export interface OneSelectItem {
    value: string;
    label: string;
    selected?: boolean;
    disabled?: boolean;
}

interface OneSelectFilterProps {
    id: string
    data: OneSelectItem[]
    spaceBetween?: SystemProp<SpacingValue>
    label?: string
    defaultValue?: string
    textClassName?: string
    selectProps?: SelectProps,
    display?: SystemProp<CSSProperties['display']>
    showClose?: boolean,
    value?: string,
    onChange?(id: string, value: string): void
    onClose?(): void
}


const OneSelectFilter = ({
    id, data, spaceBetween,
    label, defaultValue, textClassName,
    selectProps, display, showClose, value, onChange, onClose
}: OneSelectFilterProps) => {

    const handleOnChange = (value: string) => {
        if (onChange) {
            onChange(id, value)
        }
    }

    return (
        <Box display={display} mt={spaceBetween}>
            <Flex justify='space-between'>
                <Text className={textClassName}>{label}</Text>
                {showClose ? <CloseWithTooltip label={strings.hide} onClose={onClose} /> 
                : null}
            </Flex>
            <Select
                {...selectProps}
                mt={spaceBetween}
                data={data}
                defaultValue={defaultValue}
                value={value}
                onChange={handleOnChange}
                searchable
                clearable
            />
        </Box>
    )
};

export default OneSelectFilter;
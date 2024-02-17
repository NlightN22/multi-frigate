import { SelectItem, SystemProp, SpacingValue, SelectProps, Box, Flex, CloseButton, Text, Select } from '@mantine/core';
import React, { CSSProperties } from 'react';
import CloseWithTooltip from '../CloseWithTooltip';
import { strings } from '../../strings/strings';
interface OneSelectFilterProps {
    id: string
    data: SelectItem[]
    spaceBetween?: SystemProp<SpacingValue>
    label?: string
    defaultValue?: string
    textClassName?: string
    selectProps?: SelectProps,
    display?: SystemProp<CSSProperties['display']>
    showClose?: boolean,
    changedState?(id: string, value: string): void
    onClose?(): void
}


const OneSelectFilter = ({
    id, data, spaceBetween,
    label, defaultValue, textClassName,
    selectProps, display, showClose, changedState, onClose
}: OneSelectFilterProps) => {

    const handleOnChange = (value: string) => {
        if (changedState) {
            changedState(id, value)
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
                onChange={handleOnChange}
                searchable
                clearable
            />
        </Box>
    )
};

export default OneSelectFilter;
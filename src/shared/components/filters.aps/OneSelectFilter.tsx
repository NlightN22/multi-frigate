import { SelectItem, SystemProp, SpacingValue, SelectProps, Box, Flex, CloseButton, Text, Select } from '@mantine/core';
import React, { CSSProperties } from 'react';
import CloseWithTooltip from '../buttons/CloseWithTooltip';
import { strings } from '../../strings/strings';


export interface OneSelectItem {
    value: string;
    label: string;
    selected?: boolean;
    disabled?: boolean;
}

interface OneSelectFilterProps extends SelectProps {
    id?: string
    data: OneSelectItem[]
    spaceBetween?: SystemProp<SpacingValue>
    label?: string
    defaultValue?: string
    textClassName?: string
    showClose?: boolean,
    value?: string,
    onChange?: (value: string, id?: string,) => void
    onClose?: () => void
}


const OneSelectFilter = ({
    id, data, spaceBetween,
    label, defaultValue, textClassName,
    showClose, value, onChange: onChange, onClose, ...selectProps
}: OneSelectFilterProps) => {

    const handleOnChange = (value: string) => {
        if (onChange) onChange(value, id,)
    }

    const handleOnClose = () => {
        if (onClose) onClose()
    }

    return (
        <Box mt={spaceBetween}>
            <Flex justify='space-between'>
                <Text className={textClassName}>{label}</Text>
                {showClose ? <CloseWithTooltip label={strings.hide} onClose={handleOnClose} />
                    : null}
            </Flex>
            <Select
                mt={spaceBetween}
                data={data}
                defaultValue={defaultValue}
                value={value}
                onChange={handleOnChange}
                searchable
                clearable
                {...selectProps}
            />
        </Box>
    )
};

export default OneSelectFilter;
import { Box, Flex, MultiSelect, MultiSelectProps, SelectItem, SpacingValue, SystemProp, Text } from '@mantine/core';
import { t } from 'i18next';
import React, { CSSProperties, FC } from 'react';
import CloseWithTooltip from '../buttons/CloseWithTooltip';
import { useTranslation } from 'react-i18next';

interface CreatableMultiSelectProps {
    id?: string
    data: SelectItem[]
    spaceBetween?: SystemProp<SpacingValue>
    label?: string
    defaultValue?: string[]
    textClassName?: string
    selectProps?: MultiSelectProps,
    display?: SystemProp<CSSProperties['display']>
    showClose?: boolean,
    changedState?(value: string[], id?: string): void
    onClose?(): void
    onCreate?(value: string): void
}

const CreatableMultiSelect: React.FC<CreatableMultiSelectProps> = ({
    id,
    data,
    spaceBetween,
    label,
    defaultValue,
    textClassName,
    selectProps,
    display,
    showClose,
    changedState,
    onClose,
    onCreate
}) => {

    const { t } = useTranslation()

    const handleOnChange = (value: string[]) => {
        if (changedState) {
            changedState(value, id)
        }
    }

    const handleOnCreate = (query: string | SelectItem | null | undefined) => {
        const item = { value: query, label: query } as SelectItem
        if (onCreate && typeof query === 'string') {
            onCreate(query)
        }
        return item 
    }

    return (
        <Box display={display} mt={spaceBetween}>
            <Flex justify='space-between'>
                <Text className={textClassName}>{label}</Text>
                {showClose ?
                    <CloseWithTooltip label={t('hide')} onClose={onClose} />
                    : null}
            </Flex>
            <MultiSelect
                {...selectProps}
                mt={spaceBetween}
                data={data}
                defaultValue={defaultValue}
                onChange={handleOnChange}
                searchable
                clearable
                creatable
                getCreateLabel={(query) => `+ ${t('create') + ' ' + query}`}
                onCreate={handleOnCreate}
                {...selectProps}
            />
        </Box>
    );
};

export default CreatableMultiSelect;
import { Box, Flex, MultiSelect, MultiSelectProps, SelectItem, SpacingValue, SystemProp, Text } from '@mantine/core';
import { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import CloseWithTooltip from '../buttons/CloseWithTooltip';

interface MultiSelectFilterProps {
    id: string
    data: SelectItem[]
    spaceBetween?: SystemProp<SpacingValue>
    label?: string
    defaultValue?: string[]
    textClassName?: string
    selectProps?: MultiSelectProps,
    display?: SystemProp<CSSProperties['display']>
    showClose?: boolean,
    changedState?(id: string, value: string[]): void
    onClose?(): void
}

const MultiSelectFilter = ({
    id, data, spaceBetween,
    label, defaultValue, textClassName,
    selectProps, display, showClose, changedState, onClose
}: MultiSelectFilterProps) => {
    const { t } = useTranslation()

    const handleOnChange = (value: string[]) => {
        if (changedState) {
            changedState(id, value)
        }
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
            />
        </Box>
    )
};

export default MultiSelectFilter;
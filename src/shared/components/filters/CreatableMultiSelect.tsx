import { Box, Flex, Group, MultiSelect, MultiSelectProps, SelectItem, SpacingValue, SystemProp, Text } from '@mantine/core';
import React, { CSSProperties, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import CloseWithTooltip from '../buttons/CloseWithTooltip';
import { IconTrash } from '@tabler/icons-react';

interface CreatableMultiSelectProps {
    id?: string
    value?: string[]
    data: SelectItem[]
    spaceBetween?: SystemProp<SpacingValue>
    label?: string
    defaultValue?: string[]
    textClassName?: string
    display?: SystemProp<CSSProperties['display']>
    showClose?: boolean,
    onChange?(value: string[]): void
    onClose?(): void
    onCreate?(query: string | SelectItem | null | undefined): SelectItem | string | null | undefined
    error?: string
    onTrashClick?(value: string): void
}

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
    label: string,
    value: string,
    onTrashClick?: (value: string) => void
}

const DeletableItem = forwardRef<HTMLDivElement, ItemProps>(
    ({ label, value, onTrashClick, ...others }, ref) => (
        <div {...others} ref={ref}>
            <Flex justify='space-between'>
                <Text>{label}</Text>
                <IconTrash
                    onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (onTrashClick) onTrashClick(value);
                    }}
                />
            </Flex>
        </div>
    )
);

const CreatableMultiSelect: React.FC<CreatableMultiSelectProps> = ({
    id,
    value,
    data,
    spaceBetween,
    label,
    defaultValue,
    textClassName,
    display,
    showClose,
    onChange,
    onClose,
    onCreate,
    onTrashClick,
    error,
}) => {

    const { t } = useTranslation()

    const handleOnChange = (value: string[]) => {
        if (onChange) onChange(value)
    }

    const handleOnCreate = (query: string | SelectItem | null | undefined) => {
        if (onCreate) return onCreate(query)
    }

    const handleTrashClick = (value: string) => {
        if (onTrashClick) onTrashClick(value)
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
                value={value}
                mt={spaceBetween}
                data={data}
                disableSelectedItemFiltering
                defaultValue={defaultValue}
                itemComponent={forwardRef((itemProps, ref) => (
                    <DeletableItem
                        {...itemProps}
                        ref={ref} // передаем ref в DeletableItem
                        onTrashClick={handleTrashClick} // передаем коллбэк сюда напрямую
                    />
                ))}
                onChange={handleOnChange}
                searchable
                clearable
                creatable
                getCreateLabel={(query) => `+ ${t('create') + ' ' + query}`}
                onCreate={handleOnCreate}
                error={error}
            />
        </Box>
    );
};

export default CreatableMultiSelect;
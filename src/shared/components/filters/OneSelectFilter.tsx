import { Box, Flex, Select, SelectProps, SpacingValue, SystemProp, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import CloseWithTooltip from '../buttons/CloseWithTooltip';


export interface OneSelectItem {
    value: string
    label: string
    group?: string
    selected?: boolean
    disabled?: boolean
}

export interface OneSelectFilterProps extends SelectProps {
    id?: string
    data: OneSelectItem[]
    spaceBetween?: SystemProp<SpacingValue>
    label?: string
    defaultValue?: string | null
    textClassName?: string
    showClose?: boolean,
    value?: string | null,
    onChange?: (value: string, id?: string,) => void
    onClose?: () => void
}


const OneSelectFilter = ({
    id, data, spaceBetween,
    label, defaultValue, textClassName,
    showClose, value, onChange: onChange, onClose, ...selectProps
}: OneSelectFilterProps) => {
    const { t } = useTranslation()

    const handleOnChange = (value: string) => {
        if (onChange) onChange(value, id,)
    }

    const handleOnClose = () => {
        if (onClose) onClose()
    }

    return (
        <Box mt={spaceBetween}>
            {!label ? null :
                <Flex justify='space-between'>
                    <Text className={textClassName}>{label}</Text>
                    {showClose ? <CloseWithTooltip label={t('hide')} onClose={handleOnClose} />
                        : null}
                </Flex>
            }
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
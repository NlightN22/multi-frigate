import { Box, Flex, Indicator, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface DateRangeSelectFilterProps {
    onChange?(value: [Date | null, Date | null]): void
    value?: [Date | null, Date | null]
}

const DateRangeSelectFilter: FC<DateRangeSelectFilterProps> = ({
    onChange,
    value,
}: DateRangeSelectFilterProps) => {
    const { t } = useTranslation()

    const handlePick = (value: [Date | null, Date | null]) => {
        if (onChange) onChange(value)
    }

    return (
        <Box>
            <Flex
                mt='1rem'
                justify='space-between'>
                <Text>{t('selectRange')}</Text>
            </Flex>
            <DatePickerInput
                w='100%'
                mt='1rem'
                clearable
                allowSingleDateInRange
                valueFormat="YYYY-MM-DD"
                type="range"
                mx="auto"
                maw={400}
                value={value}
                onChange={handlePick}
                renderDay={(date) => {
                    const day = date.getDate();
                    const now = new Date().getDate()
                    return (
                      <Indicator size={6} color="red" offset={-5} disabled={day !== now}>
                        <div>{day}</div>
                      </Indicator>
                    );
                  }}
            />
        </Box>
    );
};



export default DateRangeSelectFilter;
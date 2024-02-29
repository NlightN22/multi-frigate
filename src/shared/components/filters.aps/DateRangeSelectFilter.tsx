import { DatePickerInput } from '@mantine/dates';
import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { strings } from '../../strings/strings';
import { Box, Flex, Indicator, Text } from '@mantine/core';
import CloseWithTooltip from '../buttons/CloseWithTooltip';
import { Context } from '../../..';
import { isProduction } from '../../env.const';

interface DateRangeSelectFilterProps {}

const DateRangeSelectFilter = ({

}: DateRangeSelectFilterProps) => {
    const { recordingsStore: recStore } = useContext(Context)

    const handlePick = (value: [Date | null, Date | null]) => {
        recStore.selectedRange = value
    }

    if (!isProduction) console.log('DateRangeSelectFilter rendered')
    return (
        <Box>
            <Flex
                mt='1rem'
                justify='space-between'>
                <Text>{strings.selectRange}</Text>
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
                value={recStore.selectedRange}
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



export default observer(DateRangeSelectFilter);
import { ActionIcon, Box, Flex, Text } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { useDebouncedState, useDebouncedValue } from '@mantine/hooks';
import { IconClock, IconX } from '@tabler/icons-react';
import React, { FC, useEffect, useRef, useState } from 'react';

interface TimePickerProps {
    value?: string
    defaultValue?: string
    label?: string
    onChange?(value: string | undefined): void
}

const TimePicker: FC<TimePickerProps> = ({
    defaultValue,
    label,
    onChange
}) => {

    const ref = useRef<HTMLInputElement | null>(null)
    const [value, setValue] = useState(defaultValue)
    const [debounced] = useDebouncedValue(value, 1600)

    const [pickerOpened, setPickerOpened] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.currentTarget.value
        setValue(inputValue)
    }

    useEffect(() => {
        if (onChange) onChange(debounced)
    }, [debounced])

    const handleClick = () => {
        if (!pickerOpened) {
            ref.current?.showPicker();
            setPickerOpened(true);
        } else {
            setPickerOpened(false)
        }
    }

    return (
        <Box>
            <Flex
                mt='1rem'
                justify='space-between'>
                <Text>{label}</Text>
            </Flex>
            <TimeInput
                value={value}
                mt='1rem'
                ref={ref}
                rightSection={
                    <>
                        {
                            !value ? null :
                                <ActionIcon
                                    onClick={() => setValue('')}
                                    ml='-1.7rem'
                                >
                                    <IconX size='1rem' />
                                </ActionIcon>
                        }
                        <ActionIcon
                            onClick={() => ref.current?.showPicker()}>
                            <IconClock size="1rem" stroke={1.5} />
                        </ActionIcon>
                    </>
                }
                maw={400}
                mx="auto"
                onChange={handleChange}
                onClick={handleClick}
            />
        </Box>
    );
};

export default TimePicker;
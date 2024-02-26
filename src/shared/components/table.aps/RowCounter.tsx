import { ActionIcon, Badge, Box, Flex, Text, useMantineTheme } from '@mantine/core';
import { useCounter, useDisclosure } from '@mantine/hooks';
import { IconMinus, IconPlus, IconX } from '@tabler/icons-react';
import InputModal from '../modal.windows/InputModal';
import { v4 as uuidv4 } from 'uuid'
import { useEffect } from 'react';

interface RowCounterProps {
    counter?: number
    setValue?(value: number): void,
    showDelete?: boolean
    onDelete?(): void
}

const RowCounter = ({ counter, setValue, showDelete, onDelete }: RowCounterProps) => {
    const [opened, { open, close }] = useDisclosure(false)
    // const [count, handlers] = useCounter(counter, { min: 0 })
    const count = counter || 0

    const handleSetValue = (value: number) => {
        if (setValue) setValue(value)
        // else handlers.set(value)
    }

    const handleOpen = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation()
        open()
    }

    const handleInrease = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        handleSetValue(count + 1)
    }

    const handleDerease = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        handleSetValue(count - 1)
    }

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        if (onDelete) onDelete()
    }

    return (
        <>
            <InputModal key={uuidv4()} inValue={counter ? counter : count} putValue={handleSetValue} opened={opened} open={open} close={close} />
            <Flex direction="row">
                <ActionIcon onClick={handleDerease} mt="0.1rem" color="red.3" size="md" radius="xl" variant="filled">
                    <IconMinus size="1.125rem" />
                </ActionIcon>
                <Box w="3rem">
                    <Badge size="xl" pl="0.2rem" pr="0.2rem" fullWidth onClick={handleOpen}>
                        {count}
                    </Badge>
                </Box>
                <ActionIcon onClick={handleInrease} mt="0.1rem" color="blue.6" size="md" radius="xl" variant="filled">
                    <IconPlus size="1.125rem" />
                </ActionIcon>
                {
                    showDelete ?
                        <ActionIcon onClick={handleDelete} ml='0.1rem' mt="0.1rem" color="red" size="md" radius="xl" variant="filled">
                            <IconX size="1.125rem" />
                        </ActionIcon>
                    :
                    <></>
                }
            </Flex>
        </>
    );
};

export default RowCounter;
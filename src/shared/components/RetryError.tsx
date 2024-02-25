import { Center, Text, ActionIcon } from '@mantine/core';
import { IconRotateClockwise } from '@tabler/icons-react';
import React from 'react';

interface RetryErrorProps {
    onRetry?: () => void
}

const RetryError = ({
    onRetry
}: RetryErrorProps) => {
    const handleClick = () => {
        if (onRetry) onRetry()
    }
    return (
        <Center>
            <Text mr='md'>Loading error</Text>
            <ActionIcon color="blue" size="md" radius="md" variant="filled">
                <IconRotateClockwise onClick={handleClick} />
            </ActionIcon>
        </Center>
    );
};

export default RetryError;
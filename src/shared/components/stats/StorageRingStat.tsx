import { Card, Center, Flex, Group, Paper, RingProgress, Stack, Text } from '@mantine/core';
import React from 'react';
import { formatMBytes } from '../../utils/data.size';

interface StorageRingStatProps {
    used: number
    free: number
    total?: number
    storageType: string
    path?: string
}

const StorageRingStat: React.FC<StorageRingStatProps> = ({
    used,
    free,
    storageType,
    total,
    path
}) => {
    const calcTotal = total || used + free
    const availablePercent = (used / calcTotal * 100)
    return (
        <Card withBorder radius="md" key={storageType} p='0.2rem'>
            <Flex align='center'>
                <RingProgress
                    size={80}
                    roundCaps
                    thickness={8}
                    sections={[
                        { value: availablePercent, color: 'blue' },
                    ]}
                    label={
                        <Center>
                            <Text size='md'>{availablePercent.toFixed(0)}%</Text>
                        </Center>
                    }
                />

                <Flex w='100%' direction='column' align='center'>
                    <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                        {storageType}
                    </Text>
                    {!path ? null :
                        <Text fw={700} size="md">
                            {path}
                        </Text>
                    }
                    <Flex w='100%' justify='space-around'>
                        <Flex direction='column'>
                            <Text>Used:</Text>
                            <Text>{formatMBytes(used)}</Text>
                        </Flex>
                        <Flex direction='column'>
                            <Text>Free:</Text>
                            <Text>{formatMBytes(free)}</Text>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Card>

    );
};

export default StorageRingStat;
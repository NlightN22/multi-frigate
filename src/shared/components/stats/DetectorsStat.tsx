import { Card, Flex, Group, Text } from '@mantine/core';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface DetectorsStatProps {
    name: string
    pid: number,
    inferenceSpeed?: number,
    cpu?: string,
    mem?: string,
}

const DetectorsStat: React.FC<DetectorsStatProps> = ({
    name,
    pid,
    inferenceSpeed,
    cpu,
    mem
}) => {
    const { t } = useTranslation()
    return (
        <Card withBorder radius="md" p='0.7rem'>
            <Flex align='center'>
                <Text c="dimmed" size="xs" tt="uppercase" fw={700} mr='0.5rem'>
                    {name}
                </Text>
                <Flex w='100%' direction='column' align='center'>
                    <Flex w='100%' justify='space-between'>
                        <Text>{t('detectorCard.pid')}: {pid}</Text>
                        <Text>{t('detectorCard.inferenceSpeed')}: {inferenceSpeed}</Text>
                    </Flex>
                    <Flex w='100%' justify='space-between'>
                        <Text>CPU: {cpu}</Text>
                        <Text>{t('detectorCard.memory')}: {mem}</Text>
                    </Flex>
                </Flex>
            </Flex>
        </Card>
    );
};

export default DetectorsStat;
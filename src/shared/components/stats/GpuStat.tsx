import { Card, Flex, Text } from '@mantine/core';
import { IconZoomQuestion } from '@tabler/icons-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface GpuStatProps {
    name: string,
    decoder?: string,
    encoder?: string,
    gpu?: string,
    mem?: string,
    onVaInfoClick?: () => void
}

const GpuStat: React.FC<GpuStatProps> = ({
    name,
    decoder,
    encoder,
    gpu,
    mem,
    onVaInfoClick
}) => {
    const { t } = useTranslation()
    return (
        <Card withBorder radius="md" p='0.7rem'>
            <Flex align='center'>
                <IconZoomQuestion
                    size='2rem'
                    color='cyan'
                    cursor='pointer'
                    onClick={onVaInfoClick} />
                <Text ml='0.5rem' c="dimmed" size="xs" tt="uppercase" fw={700} mr='0.5rem'>
                    {name}
                </Text>
                <Flex w='100%' direction='column' align='center'>
                    <Flex w='100%' justify='space-between'>
                        <Text>{t('gpuStatCard.gpu')}: {gpu}</Text>
                        <Text>{t('gpuStatCard.memory')}: {mem}</Text>
                    </Flex>
                    <Flex w='100%' justify='space-between'>
                        <Text>{t('gpuStatCard.decoder')}: {decoder}</Text>
                        <Text>{t('gpuStatCard.encoder')}: {encoder}</Text>
                    </Flex>
                </Flex>
            </Flex>
        </Card>
    );
};

export default GpuStat;
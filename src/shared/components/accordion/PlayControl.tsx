import { Flex, Group, Text } from '@mantine/core';
import { IconPlayerPlay, IconPlayerStop } from '@tabler/icons-react';
import React from 'react';

interface PlayControlProps {
    label: string,
    value: string,
    openVideoPlayer?: string,
    onClick?: (value: string) => void
}

const PlayControl = ({
    label,
    value,
    openVideoPlayer,
    onClick
}: PlayControlProps) => {
    const handleClick = (value: string) => {
        if (onClick) onClick(value)
    }
    return (
        <Flex justify='space-between'>
            {label}
            <Group>
                <Text onClick={(event) => {
                    event.stopPropagation()
                    handleClick(value)
                }}>
                    {openVideoPlayer === value ? 'Stop Video' : 'Play Video'}
                </Text>
                {openVideoPlayer === value ?
                    <IconPlayerStop onClick={(event) => {
                        event.stopPropagation()
                        handleClick(value)
                    }} />
                    :
                    <IconPlayerPlay onClick={(event) => {
                        event.stopPropagation()
                        handleClick(value)
                    }} />

                }
            </Group>
        </Flex>
    )
}

export default PlayControl;
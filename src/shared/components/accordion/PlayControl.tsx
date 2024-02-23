import { Flex, Group, Text } from '@mantine/core';
import { IconPlayerPlay, IconPlayerStop } from '@tabler/icons-react';
import React from 'react';

interface PlayControlProps {
    hour: string,
    openVideoPlayer?: string,
    onClick?: (value: string) => void
}

const PlayControl = ({
    hour,
    openVideoPlayer,
    onClick
}: PlayControlProps) => {
    const handleClick = (value: string) => {
        if (onClick) onClick(value)
    }
    return (
        <Flex justify='space-between'>
            Hour: {hour}
            <Group>
                <Text onClick={(event) => {
                    event.stopPropagation()
                    handleClick(hour)
                }}>
                    {openVideoPlayer === hour ? 'Stop Video' : 'Play Video'}
                </Text>
                {openVideoPlayer === hour ?
                    <IconPlayerStop onClick={(event) => {
                        event.stopPropagation()
                        handleClick(hour)
                    }} />
                    :
                    <IconPlayerPlay onClick={(event) => {
                        event.stopPropagation()
                        handleClick(hour)
                    }} />

                }
            </Group>
        </Flex>
    )
}

export default PlayControl;
import React from 'react';
import { Flex, Group, Text, createStyles } from '@mantine/core';
import { IconPlayerPlay, IconPlayerPlayFilled, IconPlayerStop, IconPlayerStopFilled } from '@tabler/icons-react';
import { strings } from '../../strings/strings';


const useStyles = createStyles((theme) => ({
    group: {
        backgroundColor: theme.colors.blue[7],
        borderRadius: '1rem',
        paddingLeft: '0.5rem',
        paddingRight: '0.3rem',
        '&:hover': {
            backgroundColor: theme.fn.darken(theme.colors.blue[7], 0.2),
        },
    },
    text: {
        color: theme.white,
        fontWeight: 'normal'
    },
    iconStop: {
        color: theme.colors.red[5]
    },
    iconPlay: {
        color: theme.colors.green[5]
    }
}))

interface PlayControlProps {
    label: string | JSX.Element,
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
    const { classes } = useStyles();

    const handleClick = (value: string) => {
        if (onClick) onClick(value)
    }
    return (
        <Flex justify='space-between'>
            {label}
            <Group className={classes.group}
                onClick={(event) => {
                    event.stopPropagation()
                    handleClick(value)
                }}
            >
                <Text className={classes.text}
                onClick={(event) => {
                    event.stopPropagation()
                    handleClick(value)
                }}>
                    {openVideoPlayer === value ? strings.player.stopVideo : strings.player.startVideo}
                </Text>
                {openVideoPlayer === value ?
                    <IconPlayerStopFilled
                    className={classes.iconStop}
                    onClick={(event) => {
                        event.stopPropagation()
                        handleClick(value)
                    }} />
                    :
                    <IconPlayerPlayFilled
                    className={classes.iconPlay}
                    onClick={(event) => {
                        event.stopPropagation()
                        handleClick(value)
                    }} />

                }
            </Group>
        </Flex>
    )
}

export default PlayControl;
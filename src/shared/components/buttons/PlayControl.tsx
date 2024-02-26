import React from 'react';
import { Flex, Group, Text, createStyles } from '@mantine/core';
import { IconPlayerPlay, IconPlayerPlayFilled, IconPlayerStop, IconPlayerStopFilled } from '@tabler/icons-react';
import { strings } from '../../strings/strings';
import AccordionControlButton from './AccordionControlButton';


const useStyles = createStyles((theme) => ({
    iconStop: {
        color: theme.colors.red[5]
    },
    iconPlay: {
        color: theme.colors.green[5]
    }
}))

interface PlayControlProps {
    value: string,
    playedValue?: string,
    onClick?: (value: string) => void
}

const PlayControl = ({
    value,
    playedValue,
    onClick
}: PlayControlProps) => {
    const { classes } = useStyles();

    const handleClick = (value: string) => {
        if (onClick) onClick(value)
    }
    return (
        <AccordionControlButton
            onClick={() => { handleClick(value) }}
        >
            <Flex align='center'>
                {playedValue === value ? strings.player.stopVideo : strings.player.startVideo}
                {playedValue === value ?
                    <IconPlayerStopFilled
                        className={classes.iconStop} />
                    :
                    <IconPlayerPlayFilled
                        className={classes.iconPlay} />

                }
            </Flex>
        </AccordionControlButton>
    )
}

export default PlayControl;
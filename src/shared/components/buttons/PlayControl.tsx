import { Flex, createStyles } from '@mantine/core';
import { IconPlayerPlayFilled, IconPlayerStopFilled } from '@tabler/icons-react';
import AccordionControlButton from './AccordionControlButton';
import { useTranslation } from 'react-i18next';


const useStyles = createStyles((theme) => ({
    iconStop: {
        color: theme.colors.red[5]
    },
    iconPlay: {
        color: theme.colors.green[5]
    }
}))

interface PlayControlProps {
    played: boolean,
    onClick?: () => void
}

const PlayControl = ({
    played,
    onClick
}: PlayControlProps) => {
    const { t } = useTranslation()
    const { classes } = useStyles();

    const handleClick = () => {
        if (onClick) onClick()
    }
    return (
        <AccordionControlButton
            onClick={() => { handleClick() }}
        >
            <Flex align='center'>
                {played ? t('player.stopVideo') : t('player.startVideo')}
                {played ?
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
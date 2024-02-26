import { Button, ButtonProps, Group, UnstyledButton, createStyles } from '@mantine/core';
import React from 'react';

const useStyles = createStyles((theme) => ({
    button: {
        backgroundColor: theme.colors.blue[7],
        borderRadius: '1rem',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        paddingTop: '0.4rem',
        paddingBottom: '0.4rem',
        color: theme.white,
        fontSize: '14px',
        fontWeight: 600,
        '&:hover': {
            backgroundColor: theme.fn.darken(theme.colors.blue[7], 0.2),
        },
    },
}))

interface AccordionControlButtonProps extends ButtonProps {
    children?: React.ReactNode,
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const AccordionControlButton = ({
    children,
    onClick,
    ...rest
} : AccordionControlButtonProps) => {
    const { classes } = useStyles();

    const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation()
        if (onClick) onClick(event)
    }
    return (
        <Group
        onClick={handleClick}
        className={classes.button} {...rest}>  
            {children}
        </Group>
    );
};

export default AccordionControlButton;
import React from 'react';
import {Text, TextProps, createStyles } from '@mantine/core';

const useStyles = createStyles((theme) => ({
    price: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        fontWeight: 500,
    },
}))

interface PriceTextProps extends TextProps {
    value: number,
}

const PriceText = (props: PriceTextProps, ) => {
    const { classes } = useStyles()
    return (
        <Text {...props} className={classes.price}>
            {Intl.NumberFormat().format(props.value)}
        </Text>
    );
};

export default PriceText;
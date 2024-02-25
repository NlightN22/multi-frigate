import { Paper } from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import React from 'react';

const TestItem = () => {

    const { ref, entry } = useIntersection({threshold: 0.1,})

    return (<Paper
        ref={ref}
        m='0.2rem' w='10rem' h='10rem'
        sx={(theme) => ({
            backgroundColor: entry?.isIntersecting ? theme.colors.green[9] : theme.colors.red[9],
        })}
    />)
};

export default TestItem;
import { Divider, Flex, Grid, Text } from '@mantine/core';
import React from 'react';

interface ProductParameterProps {
    paramName?: string | number
    paramValue?: string | number | string[]
}

const ProductParameter = ({paramName, paramValue}: ProductParameterProps) => {

    // if (!paramValue) return null

    const pl='1rem', pr='0.2rem', pt='0.1rem', pb='0.2rem'
    return (
        <>
        <Grid.Col  pl={pl} pr={pr} pt={pt} pb={pb} span={6}>
            <Text fw={500}>{paramName}</Text>
        </Grid.Col>
        <Grid.Col pl={pl} pr={pr} pt={pt} pb={pb} span={6}>
            <Text>{paramValue}</Text>
        </Grid.Col>
        <Divider w='100%' size="xs" />
        </>
    );
};

export default ProductParameter;
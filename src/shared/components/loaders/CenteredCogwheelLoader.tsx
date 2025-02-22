import { Flex } from '@mantine/core';
import React from 'react';
import CogwheelLoader from './CogwheelLoader';

const CenteredCogwheelLoader = () => {
    return (
        <Flex w='100%' h='100%' direction='column' justify='center' align='center'>
            <CogwheelLoader />
        </Flex>
    )
};

export default CenteredCogwheelLoader;
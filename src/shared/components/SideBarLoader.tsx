import { Box, LoadingOverlay } from '@mantine/core';
import React from 'react';
import СogwheelSVG from './svg/CogwheelSVG';

const SideBarLoader = () => {
    return (
        <Box pos='fixed' top='3.2rem' h='100%' w='95%'>
            <LoadingOverlay h='100%' children loader={СogwheelSVG} visible={true} />
        </Box>
    );
};

export default SideBarLoader;
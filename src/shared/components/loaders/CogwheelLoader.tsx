import React from 'react';
import { Center, DEFAULT_THEME } from '@mantine/core';
import CogwheelSVG from '../svg/CogwheelSVG';


const CogwheelLoader = () => {
    return (
        <Center>
            {CogwheelSVG}
        </Center>
    );
};

export default CogwheelLoader;
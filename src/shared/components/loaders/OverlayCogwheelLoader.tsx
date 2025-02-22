import { DEFAULT_THEME, Loader, LoadingOverlay } from '@mantine/core';
import React from 'react';
import СogwheelSVG from '../svg/CogwheelSVG';

const OverlayCogwheelLoader = () => {
    return <LoadingOverlay loader={СogwheelSVG} visible />;
};

export default OverlayCogwheelLoader;
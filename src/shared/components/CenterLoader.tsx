import { DEFAULT_THEME, Loader, LoadingOverlay } from '@mantine/core';
import React from 'react';
import СogwheelSVG from './svg/СogwheelSVG';

const CenterLoader = () => {
    return <LoadingOverlay loader={СogwheelSVG} visible />;
};

export default CenterLoader;
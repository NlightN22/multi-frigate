import React from 'react';
import {  Image, ImageProps } from '@mantine/core';

const Logo = ({ onClick }: ImageProps) => {
    const src = "../logo.svg"

    return (
            <Image sx={{ cursor: "pointer" }}  height={40} alt='Logo' withPlaceholder src={src} onClick={onClick} />
    );
};

export default Logo;
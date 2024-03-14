import React from 'react';
import { Image, ImageProps, useMantineTheme } from '@mantine/core';

interface LogoProps extends ImageProps {
    color?: string
}

const Logo = ({
    color,
    onClick,
    ...imageProps
}: LogoProps) => {
    const theme = useMantineTheme();
    const src = theme.colorScheme === 'dark' ? "/logo-white.svg" : "/logo.svg"

    return (
        <Image
            sx={{ cursor: "pointer" }}
            height={40}
            alt='Logo'
            withPlaceholder
            src={src}
            onClick={onClick}
            {...imageProps}
        />
    );
};

export default Logo;
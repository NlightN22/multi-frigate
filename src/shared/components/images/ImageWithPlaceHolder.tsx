import { ImageProps, Image, Center } from '@mantine/core';
import { IconPhotoOff } from '@tabler/icons-react';
import React from 'react';

const ImageWithPlaceHolder = (props: ImageProps) => {
    if (props.src && (typeof props.src === 'string')) return (
        <Image {...props} />
    )
    return (
        <Center
        onClick={(e) => {
            e.stopPropagation()
        }}>
            <IconPhotoOff
                onClick={(e) => {
                    e.stopPropagation()
                }}
            />
        </Center>
    )
}

export default ImageWithPlaceHolder
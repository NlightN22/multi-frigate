import { ImageProps, Image, Center } from '@mantine/core';
import { IconPhotoOff } from '@tabler/icons-react';
import React from 'react';

const ImageWithPlaceHolder = (props: ImageProps & React.RefAttributes<HTMLDivElement>) => {
    if (props.src) return (
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
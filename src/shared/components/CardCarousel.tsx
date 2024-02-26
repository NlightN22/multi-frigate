import { Carousel } from '@mantine/carousel';
import { AspectRatio, Image, createStyles, Text } from '@mantine/core';
import React from 'react';
import ImageWithPlaceHolder from './images/ImageWithPlaceHolder';

interface CardCarouselProps {
    image: string
    onClick?(): void
    ratio: number
    height?: string | number
}

const CardCarousel = ({ image, onClick, ratio, height }: CardCarouselProps) => {
    const handleImageClick = () => {
        if (onClick) onClick()
    }
    return (
        <Carousel.Slide>
            <AspectRatio ratio={ratio}>
                <ImageWithPlaceHolder
                    onClick={(e) => {
                        e.stopPropagation()
                        handleImageClick()
                    }}
                    src={image} height={height} />
            </AspectRatio>
        </Carousel.Slide>
    );
};

export default CardCarousel;
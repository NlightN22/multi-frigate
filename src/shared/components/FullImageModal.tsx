import { Carousel, Embla, useAnimationOffsetEffect } from '@mantine/carousel';
import { Modal, createStyles, getStylesRef, rem } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import React, { useContext, useState } from 'react';
import CardCarousel from './grid.aps/CardCarousel';
import { Context } from '../..';
import { observer } from 'mobx-react-lite';
import { v4 as uuidv4 } from 'uuid'
import { dimensions } from '../dimensions/dimensions';

// change to http://react-responsive-carousel.js.org/
const useStyles = createStyles((theme) => ({
    modal: {
        display: 'flex'
    },
    carousel: {
        height: "100%",
        flex: 1,
        '&:hover': {
            [`& .${getStylesRef('carouselControls')}`]: {
                opacity: 1,
            },
        },
    },

    carouselControls: {
        ref: getStylesRef('carouselControls'),
        transition: 'opacity 150ms ease',
        opacity: 0,
    },

    carouselIndicator: {
        width: rem(4),
        height: rem(4),
        transition: 'width 250ms ease',

        '&[data-active]': {
            width: rem(16),
        },
    },
}))

interface FullImageModalProps {
    images?: string[]
    opened?: boolean
    open?(): void
    close?(): void
}

const FullImageModal = observer(({ images, opened, open, close }: FullImageModalProps) => {
    const { modalStore } = useContext(Context)
    const { isFullImageOpened, fullImageData, closeFullImage } = modalStore
    const { classes } = useStyles();

    const TRANSITION_DURATION = 100
    const [embla, setEmbla] = useState<Embla | null>(null)
    useAnimationOffsetEffect(embla, TRANSITION_DURATION)

    const isMobile = useMediaQuery(dimensions.mobileSize)

    const handleClose = () => {
        closeFullImage()
    }

    const slides = fullImageData.length > 0
        ?
        fullImageData.map((image) => (
            <CardCarousel
                key={uuidv4()}
                image={image}
                ratio={1}
                height="100%"
            />))
        :
        <CardCarousel
            key={uuidv4()}
            image=''
            ratio={1}
            height="100%" />
            
    return (
        <Modal
            size="55%"
            opened={isFullImageOpened}
            onClose={handleClose}
            withCloseButton={true}
            centered
            fullScreen={isMobile}
            className={classes.modal}
            transitionProps={{ duration: TRANSITION_DURATION }}
        >
            <Carousel
                getEmblaApi={setEmbla}
                withIndicators
                loop
                classNames={{
                    root: classes.carousel,
                    controls: classes.carouselControls,
                    indicator: classes.carouselIndicator,
                }}
            >
                {slides}
            </Carousel>

        </Modal>

    );
})

export default FullImageModal;
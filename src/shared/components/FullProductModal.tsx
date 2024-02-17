import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../..';
import CardCarousel from './grid.aps/CardCarousel';
import { v4 as uuidv4 } from 'uuid'
import { Carousel, Embla, useAnimationOffsetEffect } from '@mantine/carousel';
import { Modal, createStyles, getStylesRef, rem, Text, Box, Flex, Grid, Divider, Center } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { dimensions } from '../dimensions/dimensions';
import { observer } from 'mobx-react-lite';
import KomponentLoader from './СogwheelLoader';
import ProductParameter from './ProductParameter';
import { productString } from '../strings/product.strings';
import { IconArrowBadgeLeft, IconArrowBadgeRight } from '@tabler/icons-react';
import { strings } from '../strings/strings';

const useStyles = createStyles((theme) => ({
    modal: {
        display: 'flex',
        flexDirection: 'column'
    },
    carousel: {
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

const FullProductModal = observer(() => {
    const { classes } = useStyles();
    const { modalStore } = useContext(Context)
    const { productDetailed, isProductDetailedOpened, closeProductDetailed } = modalStore

    const isMobile = useMediaQuery(dimensions.mobileSize)

    const TRANSITION_DURATION = 100
    const [embla, setEmbla] = useState<Embla | null>(null)
    useAnimationOffsetEffect(embla, TRANSITION_DURATION)


    const handleClose = () => {
        closeProductDetailed()
    }

    const slides = productDetailed.data && productDetailed.data.image.length > 0
        ?
        productDetailed.data.image.map((image) => (
            <CardCarousel
                key={uuidv4()}
                image={image}
                ratio={1}
                height="100%"
            />))
        : null

    const properties = productDetailed.data?.properties?.map( property => (
        <ProductParameter key={property.id} paramName={property.name} paramValue={property.value} />
    ))

    return (
        <Modal
            // size='auto'
            size='45%'
            opened={isProductDetailedOpened}
            onClose={handleClose}
            withCloseButton={true}
            centered
            fullScreen={isMobile}
            className={classes.modal}
            transitionProps={{ duration: TRANSITION_DURATION }}
        >
            {
                productDetailed.isLoading ?
                    <KomponentLoader />
                    :
                    <Center>
                    <Flex w="100%" direction='column' align='center'>
                    {/* <Flex h='40rem' w='30rem' direction='column' align='center'> */}
                        {/* <> */}
                        <Carousel
                            w='60%' // change image size
                            getEmblaApi={setEmbla}
                            withIndicators
                            loop
                            previousControlIcon={<IconArrowBadgeLeft />}
                            nextControlIcon={<IconArrowBadgeRight />}
                            controlSize={40}
                            classNames={{
                                root: classes.carousel,
                                controls: classes.carouselControls,
                                indicator: classes.carouselIndicator,
                            }}
                        >
                            {slides}
                        </Carousel>
                        <Grid mt="1rem">
                            {/* Base product parameters */}
                            <ProductParameter paramName={productString.name} paramValue={productDetailed.data?.name} />
                            <ProductParameter paramName={productString.number} paramValue={productDetailed.data?.number} />
                            <ProductParameter paramName={productString.oem} paramValue={productDetailed.data?.oem} />
                            <ProductParameter paramName={productString.stock} paramValue={productDetailed.data?.stock} />
                            <ProductParameter paramName={productString.discount} paramValue={productDetailed.data?.discount? strings.true : strings.false} />
                            <Divider w='100%' size="sm" />
                            {/* Product properties */}
                            {properties}
                            {/* {productDetailed.data?.properties? JSON.stringify(productDetailed.data?.properties) : null} */}
                        </Grid>
                    </Flex>
                    </Center>
                // {/* </> */}
            }
        </Modal>
    );
})

export default FullProductModal;
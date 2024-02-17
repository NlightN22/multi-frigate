import { Card, Group, createStyles, getStylesRef, rem, Text, Container, Badge, ColSpan, Grid, Flex } from '@mantine/core';
import React, { useContext } from 'react';
import { Carousel } from '@mantine/carousel';
import { GridAdapter } from './ProductGrid';
import CardCarousel from './CardCarousel';
import BuyCounterToggle from './BuyCounterToggle';
import Currency from '../Currency';
import { Context } from '../../..';
import { v4 as uuidv4 } from 'uuid'
import PriceText from '../PriceText';
import { observer } from 'mobx-react-lite';

const useStyles = createStyles((theme) => ({

  mainCard: {
    borderWidth: '1px',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '12rem',
    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.fn.darken(theme.colors.cyan[9], 0.5) : theme.colors.cyan[1],
    },
  },

  bottomGroup: {
    marginTop: 'auto',
  },

  priceContainer: {
    marginTop: '0.8rem',
    width: '100%',
    display: 'flex',
    gap: "0.5rem",
    justifyContent: 'center',
    alignItems: 'center',
  },

  price: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontSize: "lg",
    fontWeight: 500,
  },

  productNameGroup: {
    width: '100%',
    display: 'flex',
    gap: "0.5rem",
    justifyContent: 'center',
    alignItems: 'center',
  },

  productName: {
    fontWeight: 500,
  },

  carousel: {
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

interface GridCardProps {
  span?: ColSpan,
  item: GridAdapter
}

const GridCard = observer(({ span, item }: GridCardProps) => {
  const { classes } = useStyles();

  const { modalStore, cartStore } = useContext(Context)
  const { openFullImage, openProductDetailed } = modalStore

  const prodId = item.id
  const prodName: string = item.name
  const prodImages: string[] = item.image
  const prodPrice: number = item.cost
  const prodDiscount: boolean = item.discount
  const prodQty: number = item.qty
  //todo replace to real price
  const min = 1.0;
  const max = 1.99;
  const randomNumber = Math.random() * (max - min) + min;
  const prodDiscountPrice: number = Number((item.cost * randomNumber).toFixed(2))
  const prodDiscountPercent: number = parseFloat(((prodPrice / prodDiscountPrice - 1) * 100).toFixed(0))

  const slides = prodImages.length > 0
    ?
    prodImages.map((image) => (
      <CardCarousel
        key={uuidv4()}
        image={image}
        ratio={1}
        height={190}
        onClick={() => openFullImage(item.image)}
      />))
    :
    <CardCarousel
      key={uuidv4()}
      image=''
      ratio={100 / 100}
      height={190} />

  return (
    <>
      <Grid.Col span={span} >
        <Card radius="lg" padding='4px' withBorder className={classes.mainCard}>
          <Card.Section>
            <Carousel
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
          </Card.Section>

          <Container
            onClick={() => openProductDetailed(prodId)}
            className={classes.priceContainer}
            fluid>
            {prodDiscount ?
              <Group pl="0.3rem" style={{ display: 'flex', flexWrap: 'nowrap', gap: '0', alignItems: 'center' }}>
                <PriceText td='line-through' fs='oblique' fz='sm' value={prodDiscountPrice} />
                <Currency fz='sm' />
                <Badge style={{ alignSelf: 'center' }} color='red' size='lg' p="0">{prodDiscountPercent}%</Badge>
              </Group>
              :
              null
            }
            <Group style={{ display: 'flex', flexWrap: 'nowrap', gap: '0', alignItems: 'flex-end' }}>
              <PriceText value={prodPrice} />
              <Currency />
            </Group>
          </Container>

          <Group
            onClick={() => openProductDetailed(prodId)}
            mt='0.5rem'
            className={classes.productNameGroup}
            position="apart">
            <Text fz='sm' align="center" fw='500' className={classes.productName}>
              {prodName}
            </Text>
          </Group>
          <Group 
          className={classes.bottomGroup}>
            <Flex w='100%' justify='center' mt="0.5rem">
              <BuyCounterToggle counter={item.qty} setValue={(value) => {
                console.log("value", value)
                cartStore.setToCart(item, value)
              }} />
            </Flex>
          </Group>
        </Card>
      </Grid.Col >
    </>
  );
})

export default GridCard;
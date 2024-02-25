import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Flex, Grid, Group, Indicator, Paper, Skeleton } from '@mantine/core';
import RetryError from '../shared/components/RetryError';
import { DatePickerInput } from '@mantine/dates';
import HeadSearch from '../shared/components/HeadSearch';
import ViewSelector from '../shared/components/ViewSelector';
import { useIntersection } from '@mantine/hooks';
import TestItem from './TestItem';

const Test = observer(() => {
  const [value, setValue] = useState<[Date | null, Date | null]>([null, null])

  useEffect(() => {
    console.log('value', value)
  }, [value])

  const handleClick = () => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    setValue([startOfDay, startOfDay])
  }

  const cards = (qty: number) => {
    let items = []
    for (let i = 0; i < qty; i++) {
      items.push(<TestItem key={i} />)
    }
    return items
  }

  return (
    <Flex direction='column' h='100%' >
      <Flex justify='space-between' align='center' w='100%'>
        <Group
          w='25%'
        >
        </Group>
        <Group
          w='50%'
          style={{
            justifyContent: 'center',
          }}
        ><HeadSearch /></Group>
        <Group
          w='25%'
          position="right">
        </Group>
      </Flex>
      <Flex justify='center' h='100%' direction='column' >
        <Grid mt='sm' justify="center" mb='sm' align='stretch'>
          {cards(60)}
        </Grid>
      </Flex>
    </Flex>
  );
})

export default Test;
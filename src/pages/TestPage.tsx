import { Flex, Grid, Group } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useContext, useEffect, useRef } from 'react';
import { Context } from '..';
import HeadSearch from '../shared/components/inputs/HeadSearch';
import TestItem from './TestItem';

const Test = () => {
  const executed = useRef(false)

  const { sideBarsStore } = useContext(Context)
  sideBarsStore.rightVisible = true

  useEffect(() => {
    if (!executed.current) {
        sideBarsStore.rightVisible = false
        sideBarsStore.setLeftChildren(null)
        sideBarsStore.setRightChildren(null)
        executed.current = true
    }
}, [sideBarsStore])


  // const handleClick = () => {
  //   const startOfDay = new Date();
  //   startOfDay.setHours(0, 0, 0, 0);
  //   setValue([startOfDay, startOfDay])
  // }

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
}

export default observer(Test);
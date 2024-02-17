import React, { useContext, useEffect, useRef, useState } from 'react';
import RowCounter from './RowCounter';
import { Badge, Center, Flex, Group, Text, createStyles } from '@mantine/core';
import { TableAdapter } from './ProductTable';
import ImageWithPlaceHolder from '../ImageWithPlaceHolder';
import Currency from '../Currency';
import { Context } from '../../..';
import { observer } from 'mobx-react-lite';
import { v4 as uuidv4 } from 'uuid'
import PriceText from '../PriceText';

interface TableRowProps {
    element: TableAdapter
    selected: string
    increase?(id: string): void
    decrease?(id: string): void
    setQty?(id: string, value: number): void
    onDelete?(id: string): void
    showDelete?: boolean
}

const useStyles = createStyles((theme) => ({
    tableRow: {
        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[1],
        },
    },
    rowSelected: {
        backgroundColor:
            theme.colorScheme === 'dark'
                ? theme.fn.darken(theme.colors.cyan[9], 0.5)
                : theme.colors.cyan[1],
    },

    price: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        fontSize: "lg",
        fontWeight: 500,
    },

    discountPrice: {
        fontSize: "sm",
        fontWeight: 500,
        textDecoration: "line-through",
        fontStyle: 'oblique',
    },
}))


const TableRow = observer(({ element, selected, increase, decrease, setQty, onDelete, showDelete }: TableRowProps) => {
    const { classes, cx } = useStyles()
    const mainRef: React.LegacyRef<HTMLTableRowElement> = useRef(null)

    const { modalStore } = useContext(Context)
    const { openFullImage, openProductDetailed } = modalStore

    //todo replace to real price
    const min = 1.0;
    const max = 1.99;
    const randomNumber = Math.random() * (max - min) + min;
    const prodDiscountPrice: number = Number((element.cost * randomNumber).toFixed(2))
    const prodDiscountPercent: number = parseFloat(((element.cost / prodDiscountPrice - 1) * 100).toFixed(0))

    const handleSetQty = (value: number) => {
        if (setQty) setQty(element.id, value)
    }

    const handleDelete = () => {
        if (onDelete) onDelete(element.id)
    }

    return (
        <tr ref={mainRef}
            className={cx(
                { [classes.rowSelected]: selected === element.id },
                classes.tableRow,
            )}
        >
            <td onClick={() => {openProductDetailed(element.id)}}><Text fz='sm' fw='500'>{element.name}</Text></td>
            <td>
                < Flex direction='column' wrap='nowrap' gap='0' align='center' >
                    {element.discount ?
                        <Flex wrap='nowrap' gap='0' align='center' >
                            <Text fz='sm' className={classes.discountPrice}>
                                {Intl.NumberFormat().format(prodDiscountPrice)}
                            </Text>
                            <Currency fz='sm' />
                            <Badge style={{ alignSelf: 'center' }} color='red' size='md' p="0">{prodDiscountPercent}%</Badge>
                        </Flex>
                        :
                        null
                    }
                    <Flex wrap='nowrap' gap='0' align='flex-end' >
                        <PriceText value={element.cost} fz='sm' fw='500' />
                        <Currency fz='sm' />
                    </Flex>
                </Flex>
            </td>
            <td style={{ backgroundSize: "cover" }}>
                <ImageWithPlaceHolder
                    onClick={() => openFullImage(element.image)}
                    mah="4rem" 
                    mih="2rem" 
                    height="3rem" 
                    src={element.image[0]} />
            </td>
            <td style={{paddingLeft: 5, paddingRight: 5}}>
                <Center>
                    <Text fz='sm' fw='500'>
                        {Intl.NumberFormat().format(element.stock)}
                    </Text>
                </Center>
            </td>
            <td >
                <Center>
                    <RowCounter
                        counter={element.qty}
                        setValue={handleSetQty}
                        onDelete={handleDelete}
                        showDelete={showDelete}
                        />
                </Center>
            </td>
        </tr >
    );
})


export default TableRow;
import { Card, Grid, rem } from '@mantine/core';
import React from 'react';
import GridCard from './GridCard';
import BuyCounterToggle from './BuyCounterToggle';
import RowCounter from '../table.aps/RowCounter';

export type GridAdapter = {
    id: string,
    number: number,
    manufactory: string,
    oem: string,
    stock: number,
    receipt_date: string,
    name: string,
    cost: number,
    image: string[],
    discount: boolean,
    qty: number
}

interface ProductGridProps {
    gridData: GridAdapter[]
}

const ProductGrid = ({ gridData }: ProductGridProps) => {
    const span = "content"
    const grids = gridData.map( item => ( <GridCard key={item.id} span={span} item={item} />))

    return (
        <Grid pt="1rem" justify='center' align='stretch'>
            {grids}
        </Grid>
    );
};

export default ProductGrid;
import React from 'react';
import { productString } from '../../strings/product.strings';
import SortedTh from './SortedTh';

interface TableHeadProps {
    reverseSortDirection: boolean
    sortBy: string | null
    setSorting: (title: string) => void
}

const ProductsTableHead = ({ reverseSortDirection, sortBy, setSorting }: TableHeadProps) => {

    return (
        <thead>
            <tr>
                <SortedTh
                    title={productString.name}
                    reversed={reverseSortDirection}
                    sortedName={sortBy}
                    onSort={setSorting}
                />
                <SortedTh
                    title={productString.cost}
                    reversed={reverseSortDirection}
                    sortedName={sortBy}
                    onSort={setSorting}
                />
                <SortedTh
                    title={productString.image}
                    reversed={reverseSortDirection}
                    sortedName={sortBy}
                    onSort={setSorting}
                    textProps={{ w: '6rem', truncate: true }}
                />
                <SortedTh
                    title={productString.qty}
                    reversed={reverseSortDirection}
                    sortedName={sortBy}
                    onSort={setSorting}
                    textProps={{ w: '1rem', truncate: true }}
                />
                <SortedTh
                    title={productString.buy}
                    reversed={reverseSortDirection}
                    sortedName={sortBy}
                    onSort={setSorting}
                />
            </tr>
        </thead>
    );
};

export default ProductsTableHead;
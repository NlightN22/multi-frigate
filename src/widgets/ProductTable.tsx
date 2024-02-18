import { Table, } from '@mantine/core';
import { useContext, useEffect, useState } from 'react';
import { useDisclosure, useHotkeys, } from '@mantine/hooks';
import TableRow from '../shared/components/table.aps/TableRow';
import InputModal from '../shared/components/InputModal';
import { Context } from '..';
import { v4 as uuidv4 } from 'uuid'
import ProductsTableHead from '../shared/components/table.aps/ProductsTableHead';
import { observer } from 'mobx-react-lite';

export type TableAdapter = {
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

interface ProductTableProps {
    tableData?: TableAdapter[],
    showDelete?: boolean
}


const ProductTable = ({tableData, showDelete}: ProductTableProps) => {

    const { cartStore } = useContext(Context)
    const { sortCart  } = cartStore

    const data = tableData ? tableData : []

    const [sortBy, setSortBy] = useState<string | null>(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);

    // const [data, setData] = useState(tableData)

    const [selectedId, setSelectedId] = useState<string>("")
    const [qtyValue, setQtyValue] = useState<number>(0)

    const setSorting = (title: string) => {
        const reversed = title === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed)
        setSortBy(title)
        sortCart(reversed)
    }

    const handleUpDown = (key: string) => {
        if (!selectedId) setSelectedId(data[0].id)
        if (selectedId) {
            const currentIndex = data.findIndex(value => value.id === selectedId)
            switch (key) {
                case "up": {
                    if (currentIndex !== 0) setSelectedId(data[currentIndex - 1].id)
                    break
                }
                case "down": {
                    if (currentIndex !== data.length - 1) setSelectedId(data[currentIndex + 1].id)
                    break
                }
            }
        }
    }

    const handleLeftRight = (key: string) => {
        if (!selectedId) setSelectedId(data[0].id)
        if (selectedId) {
            if (key === 'right') {
                increaseData(selectedId)
            }
            if (key === 'left') {
                decreaseData(selectedId)
            }
        }
    }

    const increaseData = (selectedId: string) => {
        setQtyData(selectedId, qtyValue+1)
    }

    const decreaseData = (selectedId: string) => {
        if (qtyValue > 0) setQtyData(selectedId, qtyValue-1)
    }

    const setQtyData = (selectedId: string, value: number) => {
        // setData(data.map(element => {
        //     if (element.id === selectedId) return {
        //         ...element,
        //         qty: value
        //     }
        //     return element
        // }))
        const tableItem = data.find( item => item.id === selectedId)
        if (tableItem) cartStore.setToCart(tableItem, value)
        
    }

    const handleDelete = (id: string) => {
        cartStore.deleteFromCart(id)
    }

    const handleOpenInputQty = () => {
        if (selectedId) open()
    }

    const [opened, { open, close }] = useDisclosure(false)

    const handleInputModalValue = (value: number) => {
        setQtyData(selectedId, value)
    }

    useEffect(() => {
        if (data.length !== 0 && selectedId) {
            const qty = data.find( (element) => element.id === selectedId)?.qty || 0
            setQtyValue(qty)
        }
    }, [selectedId, data])

    useHotkeys([
        ['ArrowUp', () => handleUpDown('up')],
        ['ArrowDown', () => handleUpDown('down')],
        ['ArrowRight', () => handleLeftRight('right')],
        ['ArrowLeft', () => handleLeftRight('left')],
        ['mod+Enter', () => handleOpenInputQty()],
    ])

    const rows = data.map(element =>
        <TableRow
            key={element.id}
            element={element}
            selected={selectedId}
            setQty={setQtyData}
            onDelete={handleDelete}
            showDelete={showDelete}
        />
    )

    return (
        <div>
            <InputModal key={uuidv4()} inValue={qtyValue} putValue={handleInputModalValue} opened={opened} open={open} close={close} />
            <Table >
                <ProductsTableHead reverseSortDirection={reverseSortDirection} sortBy={sortBy} setSorting={setSorting} />
                <tbody>
                    {rows}
                </tbody>
            </Table>
        </div>
    )
}

export default ProductTable;
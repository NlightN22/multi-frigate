import { Button, Table } from '@mantine/core';
import React, { useState } from 'react';
import SortedTh from '../shared/components/table.aps/SortedTh';
import { DeliveryPoint } from '../shared/stores/user.store';
import { strings } from '../shared/strings/strings';
import { v4 as uuidv4 } from 'uuid'


interface DeliveryPointsTableProps {
    data: DeliveryPoint[]
}

const DeliveryPointsTable = ({ data }: DeliveryPointsTableProps) => {

    const [tableData, setData] = useState(data)

    const [reversed, setReversed] = useState(false)
    const [sortedName, setSortedName] = useState<string | null>(null)

    const handleSort = (headName: string, dataIndex: number) => {
        const reverse = headName === sortedName ? !reversed : false;
        setReversed(reverse)
        const keys = Object.keys(data[0]) as Array<keyof DeliveryPoint>
        const key = keys[dataIndex]
        if (reverse) {
            setData(sortByKey(data, key).reverse())
        } else {
            setData(sortByKey(data, key))
        }
        setSortedName(headName)
    }

    function sortByKey<T, K extends keyof T>(array: T[], key: K): T[] {
        return array.sort((a, b) => {
            let valueA = a[key];
            let valueB = b[key];

            const stringValueA = String(valueA).toLowerCase();
            const stringValueB = String(valueB).toLowerCase();

            if (stringValueA < stringValueB) return -1;
            if (stringValueA > stringValueB) return 1;
            return 0;
        });
    }

    const headTitle = [
        { propertyIndex: 1, title: strings.name },
        { propertyIndex: 2, title: strings.schedule },
        { propertyIndex: 3, title: strings.address },
        { title: '', sorting: false },
    ]

    const tableHead = headTitle.map(head => {
        return (
            <SortedTh
                key={uuidv4()}
                title={head.title}
                reversed={reversed}
                sortedName={sortedName}
                onSort={() => handleSort(head.title, head.propertyIndex ? head.propertyIndex : 0)}
                sorting={head.sorting} />
        )
    })

    const rows = tableData.map(item => {

        return (
            <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.schedule}</td>
                <td>{item.address}</td>
                <td><Button>{strings.edit}</Button></td>
            </tr>

        )
    })

    return (
        <div>
            <Table >
                <thead>
                    <tr>
                        {tableHead}
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </Table>
        </div>
    );
};

export default DeliveryPointsTable;
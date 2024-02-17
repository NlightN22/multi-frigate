import { Button, Table } from '@mantine/core';
import React, { useState } from 'react';
import SortedTh from './SortedTh';
import { DeliveryPoint } from '../../stores/user.store';
import { strings } from '../../strings/strings';
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
        if (reverse) {
            setData(sortByKey(data, dataIndex).reverse())
        } else {
            setData(sortByKey(data, dataIndex))
        }
        setSortedName(headName)
    }

    const sortByKey = (deliveryPoints: DeliveryPoint[], keyIndex: number): DeliveryPoint[] => {
        const keys = Object.keys(deliveryPoints[0]) as Array<keyof DeliveryPoint>
        return deliveryPoints.sort((a, b) => {
            const valueA = a[keys[keyIndex]].toLowerCase();
            const valueB = b[keys[keyIndex]].toLowerCase();

            if (valueA < valueB) {
                return -1;
            }
            if (valueA > valueB) {
                return 1;
            }
            return 0;
        });
    }

    const headTitle = [
        { dataIndex:1, title: strings.name },
        { dataIndex:2, title: strings.schedule },
        { dataIndex:3, title: strings.address },
        { title: '', sorting: false },
    ]

    const tableHead = headTitle.map(head => {
        return (
            <SortedTh
                key={uuidv4()}
                title={head.title}
                reversed={reversed}
                sortedName={sortedName}
                onSort={() => handleSort(head.title, head.dataIndex ? head.dataIndex : 0)}
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
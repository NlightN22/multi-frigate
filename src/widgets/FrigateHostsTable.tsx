import { Button, Flex, Switch, Table, Text, TextInput, useMantineTheme } from '@mantine/core';
import React, { useState } from 'react';
import SortedTh from '../shared/components/table.aps/SortedTh';
import { strings } from '../shared/strings/strings';
import { v4 as uuidv4 } from 'uuid'
import { FrigateHost } from '../services/frigate.proxy/frigate.api';
import { IconBulbFilled, IconBulbOff, IconDeviceFloppy, IconPencil, IconPlus, IconSettings, IconTrash } from '@tabler/icons-react';
import SwitchCell from '../shared/components/table.aps/SwitchCell';
import TextInputCell from '../shared/components/table.aps/TextInputCell';

interface FrigateHostsTableProps {
    data: FrigateHost[],
    showAddButton?: boolean,
    handleInputChange?: () => void,
    handleSwtitchToggle?: () => void,
}

const FrigateHostsTable = ({ data, showAddButton = false, handleInputChange, handleSwtitchToggle }: FrigateHostsTableProps) => {
    const [tableData, setData] = useState(data)
    const [reversed, setReversed] = useState(false)
    const [sortedName, setSortedName] = useState<string | null>(null)

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

    const handleSort = (headName: string, propertyName: string,) => {
        const reverse = headName === sortedName ? !reversed : false;
        setReversed(reverse)
        const arr = sortByKey(tableData, propertyName as keyof FrigateHost)
        if (reverse) arr.reverse()
        setData(arr)
        setSortedName(headName)
    }

    const headTitle = [
        { propertyName: 'name', title: strings.host.name },
        { propertyName: 'host', title: strings.host.url },
        { propertyName: 'enabled', title: strings.host.enabled },
        { title: '', sorting: false },
    ]

    const tableHead = headTitle.map(head => {
        return (
            <SortedTh
                key={uuidv4()}
                title={head.title}
                reversed={reversed}
                sortedName={sortedName}
                onSort={() => handleSort(head.title, head.propertyName ? head.propertyName : '')}
                sorting={head.sorting} />
        )
    })

    const handleTextChange = (id: string | number, propertyName: string, value: string,) => {
        setData(tableData.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    [propertyName]: value,
                };
            }
            return item;
        }));
    }
    const handleSwitchChange = (id: string | number, propertyName: string, value: string,) => {
        setData(tableData.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    [propertyName]: !item.enabled,
                };
            }
            return item;
        }));
    }

    const handleDeleteRow = (id: string | number) => {
        setData(tableData.filter(item => item.id !== id))
    }

    const handleAddRow = () => {
        const newHost: FrigateHost = {
            id: String(Math.random()),
            createAt: '',
            updateAt: '',
            host: '',
            name: '',
            enabled: true
        }
        setData(prevTableData => [...prevTableData, newHost])
    }

    const rows = tableData.map(item => {
        return (
            <tr key={item.id}>
                <TextInputCell text={item.name} width='40%' id={item.id} propertyName='name' onChange={handleTextChange} />
                <TextInputCell text={item.host} width='40%' id={item.id} propertyName='host' onChange={handleTextChange} />
                {/* {textInputCell(item.host,  '40%', item.id, 'host', handleTextChange)} */}
                <SwitchCell value={item.enabled} width='10%' id={item.id} propertyName='enabled' toggle={handleSwitchChange} />
                <td align='right' style={{ width: '10%', padding: '0', }}>
                    <Flex justify='center'>
                        <Button size='xs' ><IconSettings /></Button>
                        <Button size='xs' ><IconDeviceFloppy /></Button>
                        <Button size='xs' onClick={() => handleDeleteRow(item.id)}><IconTrash /></Button>
                    </Flex>
                </td>
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
            {showAddButton ?
                <Flex w='100%' justify='end'>
                    <Button size='xs' onClick={() => handleAddRow()}><IconPlus /></Button>
                </Flex>
                : <></>
            }
        </div>
    );
};

export default FrigateHostsTable;
import { Button, Flex, Table } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import ObjectId from 'bson-objectid';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GetFrigateHost } from '../../services/frigate.proxy/frigate.schema';
import HostSettingsMenu from '../../shared/components/menu/HostSettingsMenu';
import SortedTh from '../../shared/components/table.aps/SortedTh';
import { isProduction } from '../../shared/env.const';
import StateCell from './StateCell';
import SwitchCell from './SwitchCell';
import TextInputCell from './TextInputCell';
import { useTranslation } from 'react-i18next';
import { sortByKey } from '../../shared/utils/sort.array';

interface TableProps<T> {
    data: T[],
    showAddButton?: boolean,
    saveCallback?: (tableData: T[]) => void,
    changedCallback?: (tableData: T[]) => void,
}

const FrigateHostsTable = ({ data, showAddButton = false, saveCallback, changedCallback }: TableProps<GetFrigateHost>) => {
    const { t } = useTranslation()

    const [tableData, setTableData] = useState(data)
    const [reversed, setReversed] = useState(false)
    const [sortedName, setSortedName] = useState<string | null>(null)


    useEffect(() => {
        setTableData(data);
    }, [data]);

    useEffect(() => {
        if (!isProduction) console.log('TableData', tableData)
        if (changedCallback)
            changedCallback(tableData)
    }, [tableData])

    const handleSort = (headName: string, propertyName: string,) => {
        const reverse = headName === sortedName ? !reversed : false;
        setReversed(reverse)
        const arr = sortByKey(tableData, propertyName as keyof GetFrigateHost)
        if (reverse) arr.reverse()
        setTableData(arr)
        setSortedName(headName)
    }

    const headTitle = [
        { propertyName: 'name', title: t('frigateHostTableTitles.host') },
        { propertyName: 'host', title: t('frigateHostTableTitles.url') },
        { propertyName: 'enabled', title: t('frigateHostTableTitles.enabled') },
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

    const handleTextChange = (id: string | number, propertyName: string, value: string | number | boolean | undefined,) => {
        setTableData(tableData.map(item => {
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
        setTableData(tableData.map(item => {
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
        setTableData(tableData.filter(item => item.id !== id))
    }

    const handleAddRow = (event: React.MouseEvent<HTMLButtonElement>) => {
        const newHost: GetFrigateHost = {
            id: ObjectId().toHexString(),
            createAt: '',
            updateAt: '',
            host: '',
            name: '',
            enabled: true
        }
        setTableData([...tableData, newHost])
    }

    const rows = tableData.map(item => {
        return (
            <tr key={item.id}>
                <TextInputCell
                    text={item.name}
                    width='40%'
                    id={item.id}
                    propertyName='name'
                    onChange={handleTextChange}
                    placeholder={t('frigateHostTablePlaceholders.name')}
                />
                <TextInputCell
                    text={item.host}
                    width='40%'
                    id={item.id}
                    propertyName='host'
                    onChange={handleTextChange}
                    placeholder={t('frigateHostTablePlaceholders.host')}
                    />
                <SwitchCell value={item.enabled} width='5%' id={item.id} propertyName='enabled' toggle={handleSwitchChange} />
                <StateCell id={item.id} width='5%' />
                <td align='right' style={{ width: '10%', padding: '0', }}>
                    <Flex justify='center'>
                        <HostSettingsMenu host={item} />
                        <Button size='xs' onClick={() => handleDeleteRow(item.id)}><IconTrash /></Button>
                    </Flex>
                </td>
            </tr>
        )
    })
    if (!isProduction) console.log('FrigateHostsTable rendered')
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
                    <Button size='xs' onClick={handleAddRow}><IconPlus /></Button>
                </Flex>
                : <></>
            }
        </div>
    );
};

export default FrigateHostsTable;
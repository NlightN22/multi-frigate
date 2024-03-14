import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useEffect, useState } from 'react';
import { frigateQueryKeys, mapHostToHostname, proxyApi } from '../../services/frigate.proxy/frigate.api';
import { GetFrigateHost } from '../../services/frigate.proxy/frigate.schema';
import CogwheelLoader from '../../shared/components/loaders/CogwheelLoader';
import RetryError from '../../shared/components/RetryError';
import { Center, Flex, Table, Text } from '@mantine/core';
import { TableHead } from '../../types/table';
import SortedTh from '../../shared/components/table.aps/SortedTh';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { sortByKey } from '../../shared/utils/sort.array';
import { formatMBytes } from '../../shared/utils/data.size';


export interface StorageItem {
    cameraName: string
    usage: number
    usagePercent: number
    sreamBandwidth: number // MiB/hr
}

interface TableProps {
    host?: GetFrigateHost
}

const FrigateStorageStateTable: React.FC<TableProps> = ({
    host
}) => {

    const [reversed, setReversed] = useState(false)
    const [sortedName, setSortedName] = useState<string | null>(null)
    const { t } = useTranslation()

    const { data, isError, isPending, refetch } = useQuery({
        queryKey: [frigateQueryKeys.getHostStorage, host?.id],
        queryFn: () => {
            const hostName = mapHostToHostname(host)
            if (!hostName) return null
            return proxyApi.getHostStorage(hostName)
        }
    })

    const mapToTable = useCallback(() => {
        if (!data) return []
        return Object.entries(data).map<StorageItem>(([name, storage]) => {
            return {
                cameraName: name,
                usage: storage.usage || 0,
                usagePercent: storage.usage_percent || 0,
                sreamBandwidth: storage.bandwidth || 0,
            }
        })
    }, [data])

    const [tableData, setTableData] = useState<StorageItem[]>(mapToTable())

    useEffect( () => {
        setTableData(mapToTable())
    }, [data])

    const handleSort = (headName: string, propertyName: string,) => {
        if (!data || !tableData) return
        const reverse = headName === sortedName ? !reversed : false;
        setReversed(reverse)
        const arr = sortByKey(tableData, propertyName as keyof StorageItem)
        if (reverse) arr.reverse()
        setTableData(arr)
        setSortedName(headName)
    }

    if (isPending) return <CogwheelLoader />
    if (isError) return <RetryError onRetry={refetch} />
    if (!tableData ) return <Center><Text>{t('errors.emptyResponse')}</Text></Center>

    const headTitle: TableHead[] = [
        { propertyName: 'cameraName', title: t('camera') },
        { propertyName: 'usage', title: t('cameraStorageTable.usage') },
        { propertyName: 'usagePercent', title: t('cameraStorageTable.usagePercent') },
        { propertyName: 'sreamBandwidth', title: t('cameraStorageTable.sreamBandwidth') },
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

    const rows = tableData.map(item => {
        return (
            <tr key={item.cameraName}>
                <td><Text align='center'>{item.cameraName}</Text></td>
                <td><Text align='center'>{formatMBytes(item.usage)}</Text></td>
                <td><Text align='center'>{item.usagePercent.toFixed(4)} %</Text></td>
                <td><Text align='center'>{item.sreamBandwidth.toFixed(2) } MiB/hr</Text></td>
            </tr>
        )
    })

    const totalRow = () => {
        const totalUsage = tableData.reduce((acc, curr) => acc + curr.usage, 0)
        const totalStreamBandwidth = tableData.reduce((acc, curr) => acc + curr.sreamBandwidth, 0)
        const totalUsagePercent = tableData.reduce((acc, curr) => acc + curr.usagePercent, 0)
        return (
            <tr key={totalUsage}>
                <td><Text align='center'>{t('cameraStorageTable.total')}</Text></td>
                <td><Text align='center'>{formatMBytes(totalUsage)}</Text></td>
                <td><Text align='center'>{totalUsagePercent.toFixed(4)} %</Text></td>
                <td><Text align='center'>{totalStreamBandwidth.toFixed(2)} MiB/hr</Text></td>
            </tr>
        )        
    }

    return (
        <Table >
            <thead>
                <tr>
                    {tableHead}
                </tr>
            </thead>
            <tbody>
                {rows}
                {totalRow()}
            </tbody>
        </Table>
    );
};

export default FrigateStorageStateTable;
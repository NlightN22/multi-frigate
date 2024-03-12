import { Flex, Table, Text } from '@mantine/core';
import { IconZoomQuestion } from '@tabler/icons-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import SortedTh from '../../shared/components/table.aps/SortedTh';
import { isProduction } from '../../shared/env.const';
import { sortByKey } from '../../shared/utils/sort.array';
import { TableHead } from '../../types/table';


export interface CameraItem {
    cameraName: string,
    process: ProcessType,
    pid: number,
    fps: number,
    cpu: string,
    mem: string,
}

export enum ProcessType {
    Ffmpeg = "Ffmpeg",
    Capture = "Capture",
    Detect = "Detect",
}

interface TableProps<T> {
    data: T[],
    onFfprobeClick?: (cameraName: string) => void
}

const FrigateCamerasStateTable = ({
    data,
    onFfprobeClick
}: TableProps<CameraItem>) => {

    const { t } = useTranslation()

    const [tableData, setTableData] = useState(data)
    const [reversed, setReversed] = useState(false)
    const [sortedName, setSortedName] = useState<string | null>(null)


    const handleSort = (headName: string, propertyName: string,) => {
        const reverse = headName === sortedName ? !reversed : false;
        setReversed(reverse)
        const arr = sortByKey(tableData, propertyName as keyof CameraItem)
        if (reverse) arr.reverse()
        setTableData(arr)
        setSortedName(headName)
    }

    const headTitle: TableHead[] = [
        { propertyName: 'cameraName', title: t('camera') },
        { propertyName: 'process', title: t('cameraStatTable.process') },
        { propertyName: 'pid', title: t('cameraStatTable.pid'), sorting: false },
        { propertyName: 'fps', title: t('cameraStatTable.fps') },
        { propertyName: 'cpu', title: t('cameraStatTable.cpu') },
        { propertyName: 'mem', title: t('cameraStatTable.memory') },
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

    if (!isProduction) console.log('FrigateCamerasStateTable rendered')

    const handleFfprobe = (cameraName: string) => {
        onFfprobeClick?.(cameraName)
    }

    const rows = tableData.map(item => {
        return (
            <tr key={item.cameraName + item.process}>
                <td><Text align='center'>{item.cameraName}</Text></td>
                <td>
                    <Flex justify='center'>
                        <Text align='center' mr='0.2rem'>{item.process}</Text>
                        {item.process !== ProcessType.Ffmpeg ? null :
                            <IconZoomQuestion
                                color='cyan'
                                cursor='pointer'
                                onClick={() => handleFfprobe(item.cameraName)} />}
                    </Flex>
                </td>
                <td><Text align='center'>{item.pid}</Text></td>
                <td><Text align='center'>{item.fps}</Text></td>
                <td><Text align='center'>{item.cpu}</Text></td>
                <td><Text align='center'>{item.mem}</Text></td>
            </tr>
        )
    })

    return (
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
    );
};

export default FrigateCamerasStateTable;
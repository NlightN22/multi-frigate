import React, { useContext, useEffect, useState } from 'react';
import FrigateHostsTable from '../widgets/FrigateHostsTable';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {  frigateApi, frigateQueryKeys } from '../services/frigate.proxy/frigate.api';
import { deleteFrigateHostSchema, GetFrigateHost, putFrigateHostSchema} from '../services/frigate.proxy/frigate.schema';
import CenterLoader from '../shared/components/CenterLoader';
import RetryError from './RetryError';
import { Context } from '..';
import { strings } from '../shared/strings/strings';
import { Button, Flex } from '@mantine/core';
import { observer } from 'mobx-react-lite'

const FrigateHostsPage = observer(() => {
    const queryClient = useQueryClient()
    const { isPending: hostsPending, error: hostsError, data } = useQuery({
        queryKey: [frigateQueryKeys.getFrigateHosts],
        queryFn: frigateApi.getHosts,
    })

    const { sideBarsStore } = useContext(Context)
    useEffect(() => {
        sideBarsStore.rightVisible = false
        sideBarsStore.setLeftChildren(null)
        sideBarsStore.setRightChildren(null)
    }, [])

    const [pageData, setPageData] = useState(data)

    useEffect(() => {
        if (data) setPageData(data)
    }, [data])

    const { mutate } = useMutation({
        mutationFn: (tableData: GetFrigateHost[]) => {
            let fetchPromises = []
            const toDelete = data?.filter(host => !tableData.some(table => table.id === host.id))
            if (toDelete && toDelete.length > 0) {
                const parsedDelete = deleteFrigateHostSchema.array().parse(toDelete)
                fetchPromises.push(frigateApi.deleteHosts(parsedDelete))
            }
            if (tableData && tableData.length > 0) {
                const parsedChanged = putFrigateHostSchema.array().parse(tableData)
                fetchPromises.push(frigateApi.putHosts(parsedChanged))
            }
            return Promise.all(fetchPromises)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [frigateQueryKeys.getFrigateHosts] })
        },
        onError: () => {
            queryClient.invalidateQueries({ queryKey: [frigateQueryKeys.getFrigateHosts] })
        },
        onSettled: () => {
            if (data) setPageData([...data])
        }
    })

    const handleSave = () => {
        if (pageData) {
            mutate(pageData)
        }
    }

    const handleChange = (data: GetFrigateHost[]) => {
        setPageData(data)
    }

    const handleDiscard = () => {
        queryClient.invalidateQueries({ queryKey: [frigateQueryKeys.getFrigateHosts] })
        if (data) setPageData([...data])
    }

    if (hostsPending) return <CenterLoader />
    if (hostsError) return <RetryError />
    return (
        <div>
            {
                !pageData ? <></> :
                    <FrigateHostsTable data={pageData} showAddButton changedCallback={handleChange} />
            }
            <Flex justify='center'>
                <Button m='0.5rem' onClick={handleDiscard}>{strings.discard}</Button>
                <Button m='0.5rem' onClick={handleSave}>{strings.save}</Button>
            </Flex>
        </div>
    );
})

export default FrigateHostsPage;
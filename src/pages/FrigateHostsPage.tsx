import { Button, Flex, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Context } from '..';
import { useAdminRole } from '../hooks/useAdminRole';
import { frigateApi, frigateQueryKeys } from '../services/frigate.proxy/frigate.api';
import { GetFrigateHost, deleteFrigateHostSchema, putFrigateHostSchema } from '../services/frigate.proxy/frigate.schema';
import CenterLoader from '../shared/components/loaders/CenterLoader';
import { isProduction } from '../shared/env.const';
import FrigateHostsTable from '../widgets/FrigateHostsTable';
import Forbidden from './403';
import RetryErrorPage from './RetryErrorPage';


const FrigateHostsPage = () => {
    const { t } = useTranslation()

    const executed = useRef(false)
    const queryClient = useQueryClient()
    const { isPending: hostsPending, error: hostsError, data } = useQuery({
        queryKey: [frigateQueryKeys.getFrigateHosts],
        queryFn: frigateApi.getHosts,
    })

    const { sideBarsStore } = useContext(Context)
    useEffect(() => {
        if (!executed.current) {
            sideBarsStore.rightVisible = false
            sideBarsStore.setLeftChildren(null)
            sideBarsStore.setRightChildren(null)
            executed.current = true
        }
    }, [sideBarsStore])
    const { isAdmin, isLoading: adminLoading } = useAdminRole()
    const [pageData, setPageData] = useState(data)

    useEffect(() => {
        if (data) setPageData(data)
    }, [data])

    useEffect(() => {
        if (!isProduction) console.log('pageData', pageData)
    }, [pageData])

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
            return Promise.all(fetchPromises).catch(error => {
                if (error.response && error.response.data) {
                    return Promise.reject(error.response.data);
                }
                return Promise.reject(error);
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [frigateQueryKeys.getFrigateHosts] })
        },
        onError: (e) => {
            if (e && e.message) {
                notifications.show({
                    id: e.message,
                    withCloseButton: true,
                    autoClose: 5000,
                    title: "Error",
                    message: e.message,
                    color: 'red',
                    icon: <IconAlertCircle />,
                })
            }
            queryClient.invalidateQueries({ queryKey: [frigateQueryKeys.getFrigateHosts] })
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

    if (hostsPending || adminLoading) return <CenterLoader />
    if (!isAdmin) return <Forbidden />
    if (hostsError) return <RetryErrorPage />
    if (!pageData) return <Text>Empty server response</Text>

    return (
        <Flex w='100%' h='100%' direction='column'>
            <FrigateHostsTable data={pageData} showAddButton changedCallback={handleChange} />
            <Flex justify='center'>
                <Button m='0.5rem' onClick={handleDiscard}>{t('discard')}</Button>
                <Button m='0.5rem' onClick={handleSave}>{t('save')}</Button>
            </Flex>
        </Flex>
    );
}

export default observer(FrigateHostsPage);
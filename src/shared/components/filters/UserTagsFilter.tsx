import { SelectItem } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { frigateApi, frigateQueryKeys } from '../../../services/frigate.proxy/frigate.api';
import { mapUserTagsToSelectItems, PutUserTag } from '../../../types/tags';
import RetryError from '../RetryError';
import CenteredCogwheelLoader from '../loaders/CenteredCogwheelLoader';
import CreatableMultiSelect from './CreatableMultiSelect';


interface UserTagsFilterProps {
    selectedTags?: string[]
    onChange?(tagIds: string[]): void
}


const UserTagsFilter: React.FC<UserTagsFilterProps> = ({
    selectedTags,
    onChange
}) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    const [selectedList, setSelectedList] = useState<string[]>(selectedTags || [])

    useEffect(() => { 
        if (onChange) onChange(selectedList)
    }, [selectedList])

    const { data, isPending, isError, refetch } = useQuery({
        queryKey: [frigateQueryKeys.getUserTags],
        queryFn: frigateApi.getUserTags
    })

    const SelectItemSchema = z.object({
        value: z.string(),
        label: z.string().optional(),
        selected: z.boolean().optional(),
        disabled: z.boolean().optional(),
        group: z.string().optional(),
    }).passthrough();

    const [tagsError, setTagsError] = useState<string>('')

    const validateNewTag = (query: string): boolean => {
        if (query.length > 10) {
            setTagsError(t('mainPage.tagsError'))
            return false
        }
        return true
    }

    const { mutate: addTag } = useMutation({
        mutationFn: (newTag: PutUserTag) => frigateApi.putUserTag(newTag)
            .catch(error => {
                if (error.response && error.response.data) {
                    return Promise.reject(error.response.data)
                }
                return Promise.reject(error)
            }),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [frigateQueryKeys.getUserTags] })
            queryClient.invalidateQueries({ queryKey: [frigateQueryKeys.getCamerasWHost] })
        },
        onError: (e) => {
            if (e && e.message) {
                notifications.show({
                    id: e.message,
                    withCloseButton: true,
                    autoClose: 5000,
                    title: t('error'),
                    message: e.message,
                    color: 'red',
                    icon: <IconAlertCircle />,
                })
            }
        }
    })

    const { mutate: deleteTag } = useMutation({
        mutationFn: (tagId: string) => frigateApi.delUserTag(tagId)
            .catch(error => {
                if (error.response && error.response.data) {
                    return Promise.reject(error.response.data)
                }
                return Promise.reject(error)
            }),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [frigateQueryKeys.getUserTags] })
            queryClient.invalidateQueries({ queryKey: [frigateQueryKeys.getCamerasWHost] })
            const updatedList = selectedList.filter(item => data.id === item)
            setSelectedList(updatedList)
        },
        onError: (e) => {
            if (e && e.message) {
                notifications.show({
                    id: e.message,
                    withCloseButton: true,
                    autoClose: 5000,
                    title: t('error'),
                    message: e.message,
                    color: 'red',
                    icon: <IconAlertCircle />,
                })
            }
            queryClient.invalidateQueries({ queryKey: [frigateQueryKeys.getFrigateHosts] })
        }
    })

    const saveNewTag = (value: string) => {
        const newTag: PutUserTag = {
            value,
        }
        addTag(newTag)
    }

    const onCreate = (query: string | SelectItem | null | undefined) => {
        setTagsError('')
        const parseQuery = SelectItemSchema.safeParse(query)
        if (typeof query === 'string') {
            if (!validateNewTag(query)) return undefined
            saveNewTag(query)
        }
        else if (parseQuery.success) {
            const parsedQuery = parseQuery.data as SelectItem
            if (!validateNewTag(parsedQuery.value)) return undefined
            saveNewTag(parsedQuery.value)
        }
    }

    if (isPending) return <CenteredCogwheelLoader />
    if (isError) return <RetryError onRetry={refetch} />

    const handleOnChange = (value: string[]) => {
        const updatedList = selectedList.filter(item => value.includes(item))
        const newItems = value.filter(item => !selectedList.includes(item))
        setSelectedList([...updatedList, ...newItems])
    }

    const handleTrashClick = (value: string) => {
        if (value) {
            deleteTag(value)
        }
    }

    return (
        <CreatableMultiSelect
            value={selectedList}
            label={t('mainPage.createSelectTags')}
            onChange={handleOnChange}
            spaceBetween='1rem'
            data={mapUserTagsToSelectItems(data)}
            onCreate={onCreate}
            error={tagsError}
            onTrashClick={handleTrashClick}
        />
    );
};

export default UserTagsFilter;
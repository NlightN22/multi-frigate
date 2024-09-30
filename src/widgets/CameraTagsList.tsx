import { Flex } from '@mantine/core';
import { dataTagSymbol, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { frigateApi, frigateQueryKeys } from '../services/frigate.proxy/frigate.api';
import { GetCameraWHostWConfig } from '../services/frigate.proxy/frigate.schema';
import AddBadge from '../shared/components/AddBadge';
import TagBadge from '../shared/components/TagBadge';
import { CameraTag, PutUserTag } from '../types/tags';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle } from '@tabler/icons-react';


interface CameraTagsListProps {
    camera: GetCameraWHostWConfig
}

const CameraTagsList: React.FC<CameraTagsListProps> = ({
    camera
}) => {

    const [tagsList, setTagsList] = useState<CameraTag[]>(camera.tags)

    useEffect(()=>{
        setTagsList(camera.tags)
    },[camera])


    const { mutate: addTagToCamera } = useMutation({
        mutationFn: async (tagId: string) => frigateApi.putTagToCamera(camera.id, tagId)
            .catch(error => {
                if (error.response && error.response.data) {
                    return Promise.reject(error.response.data)
                }
                return Promise.reject(error)
            }),
        onSuccess: (data) => {
            setTagsList(data.tags)
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
        }
    })


    const { mutate: deleteTagFromCamera } = useMutation({
        mutationFn: (tagId: string) => frigateApi.deleteTagFromCamera(camera.id, tagId)
            .catch(error => {
                if (error.response && error.response.data) {
                    return Promise.reject(error.response.data)
                }
                return Promise.reject(error)
            }),
        onSuccess: (data) => setTagsList(data.tags),
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
        }
    })

    const handleAddTagClick = (tagId: string) => {
        if (tagId) addTagToCamera(tagId)
    }

    const handleDeleteTagClick = (tagId: string) => {
        if (tagId) deleteTagFromCamera(tagId)
    }

    return (
        <Flex justify='end' w='100%' wrap="wrap">
            {
                tagsList && tagsList.length > 0 ? tagsList.map(tag => (
                    <TagBadge
                        key={tag.id}
                        value={tag.id}
                        label={tag.value}
                        onClose={handleDeleteTagClick}
                    />
                ))
                : <></>
            }
            <AddBadge
                onClick={handleAddTagClick}
            />
        </Flex>
    );
};

export default CameraTagsList;
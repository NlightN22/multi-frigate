import { Button, Center, Flex, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle, IconCircleCheck } from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useAdminRole } from '../hooks/useAdminRole';
import { frigateApi, frigateQueryKeys, mapHostToHostname, proxyApi } from '../services/frigate.proxy/frigate.api';
import MaskSelect, { MaskItem, MaskType } from '../shared/components/filters/MaskSelect';
import CenterLoader from '../shared/components/loaders/CenterLoader';
import { Point, extractMaskNumber } from '../shared/utils/maskPoint';
import CameraMaskDrawer from '../widgets/CameraMaskDrawer';
import CameraPageHeader from '../widgets/header/CameraPageHeader';
import Forbidden from './403';
import RetryErrorPage from './RetryErrorPage';

const EditCameraPage = () => {
    const { t } = useTranslation()
    let { id: cameraId } = useParams<'id'>()
    if (!cameraId) throw Error(t('editCameraPage.cameraIdNotExist'))
    const [selectedMask, setSelectedMask] = useState<MaskItem>()
    const [points, setPoints] = useState<Point[]>()

    const { data: camera, isPending, isError, refetch } = useQuery({
        queryKey: [frigateQueryKeys.getCameraWHost, cameraId],
        queryFn: () => frigateApi.getCameraWHost(cameraId!)
    })

    const { mutate } = useMutation({
        mutationFn: () => {
            if (!selectedMask || !points || !camera) return Promise.reject(t('editCameraPage.errorAtPut'))
            if (points.length < 3) return Promise.reject(t('editCameraPage.errorAtPut'))
            const hostName = mapHostToHostname(camera.frigateHost)
            if (!hostName) return Promise.reject(t('editCameraPage.errorAtPut'))
            switch (selectedMask.type) {
                case MaskType.Motion: {
                    const index = extractMaskNumber(selectedMask.id)
                    if (index === null) return Promise.reject(t('editCameraPage.errorAtPut'))
                    return proxyApi.putMotionMask(hostName, camera.name, index, Point.arrayToRequest(points))
                        .catch(error => {
                            if (error.response && error.response.data) {
                                return Promise.reject(error.response.data)
                            }
                            return Promise.reject(error)
                        })
                }
                case MaskType.Object: {
                    let maskName = selectedMask.id
                    if (selectedMask.id.startsWith('add_new_')) {
                        maskName = selectedMask.id.replace('add_new_', '')
                    }
                    return proxyApi.putZoneMask(hostName, camera.name, maskName, Point.arrayToRequest(points))
                        .catch(error => {
                            if (error.response && error.response.data) {
                                return Promise.reject(error.response.data)
                            }
                            return Promise.reject(error)
                        })
                }
                case MaskType.Zone: {
                    const index = extractMaskNumber(selectedMask.id)
                    if (index === null) return Promise.reject(t('editCameraPage.errorAtPut'))
                    let maskName = selectedMask.id
                    if (selectedMask.id.startsWith('add_new_')) {
                        maskName = selectedMask.id.replace('add_new_', '')
                    }
                    maskName = maskName.split('_')[0]
                    return proxyApi.putObjectMask(hostName, camera.name, maskName, index, Point.arrayToRequest(points))
                        .catch(error => {
                            if (error.response && error.response.data) {
                                return Promise.reject(error.response.data)
                            }
                            return Promise.reject(error)
                        })
                }
            }
        },
        onSuccess: (data) => {
            notifications.show({
                id: data?.message,
                withCloseButton: true,
                autoClose: 5000,
                title: `Sucess: ${data?.success}`,
                message: data?.message,
                color: 'green',
                icon: <IconCircleCheck />
            })
        },
        onError: (e) => {
            notifications.show({
                id: e.message,
                withCloseButton: true,
                autoClose: false,
                title: t('error'),
                message: e.message,
                color: 'red',
                icon: <IconAlertCircle />,
            })
        },
    })

    const { isAdmin, isLoading: adminLoading } = useAdminRole()

    if (isPending || adminLoading) return <CenterLoader />
    if (!isAdmin) return <Forbidden />
    if (isError) return <RetryErrorPage onRetry={refetch} />

    const hostName = mapHostToHostname(camera.frigateHost)

    if (!hostName) return (
        <Center>
            <Text>{t('editCameraPage.notFrigateCamera')}</Text>
        </Center>
    )

    if (!camera.config) return (
        <Center>
            <Text>{t('editCameraPage.cameraConfigNotExist')}</Text>
        </Center>
    )

    const handleSelectMask = (mask?: MaskItem) => {
        setSelectedMask(mask)
        setPoints(mask?.coordinates)
    }

    const handleChangePoints = (points: Point[]) => {
        setPoints(points)
    }

    const handleSave = () => {
        if (!selectedMask || !points) return
        mutate()
    }

    const handleReset = () => {
        setPoints(selectedMask?.coordinates)
    }

    const handleClear = () => {
        setPoints([])
    }

    return (
        <Flex w='100%' h='100%' direction='column'>
            <CameraPageHeader camera={camera} configButton/>
            {!camera.config ? null :
                <Flex w='100%' justify='center' mb='1rem'>
                    <MaskSelect
                        miw='50%'
                        cameraConfig={camera.config}
                        onSelect={handleSelectMask}
                    />
                </Flex>
            }
            {!points ? null :
                <Flex justify='center' align='center' mb='1rem'>
                    <Text mr='1rem'>{t('editCameraPage.points')}: {points.map(point => `(x: ${point.x}, y: ${point.y}) `)}</Text>
                    <Flex>
                        <Button onClick={handleSave} ml='0.5rem'>Save</Button>
                        <Button onClick={handleReset} ml='0.5rem'>Reset</Button>
                        <Button onClick={handleClear} ml='0.5rem'>Clear</Button>
                    </Flex>
                </Flex>
            }
            {!points || !camera.config ? null :
                <CameraMaskDrawer
                    cameraWidth={camera.config.detect.width}
                    cameraHeight={camera.config.detect.height}
                    imageUrl={proxyApi.cameraImageURL(hostName, camera.name)}
                    inPoints={points}
                    onChange={handleChangePoints} />
            }
        </Flex>
    );
};

export default observer(EditCameraPage);
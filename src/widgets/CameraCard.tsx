import { Button, Card, Flex, Grid, Group, Text, createStyles } from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAdminRole } from '../hooks/useAdminRole';
import { recordingsPageQuery } from '../pages/RecordingsPage';
import { routesPath } from '../router/routes.path';
import { mapHostToHostname, proxyApi } from '../services/frigate.proxy/frigate.api';
import { GetCameraWHostWConfig } from '../services/frigate.proxy/frigate.schema';
import AutoUpdatedImage from '../shared/components/images/AutoUpdatedImage';
import CameraTagsList from './CameraTagsList';
import { eventsQueryParams } from '../shared/stores/events.store';

const useStyles = createStyles((theme) => ({
    mainCard: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        backgroundColor: theme.colorScheme === 'dark' ? theme.fn.darken(theme.colors.gray[7], 0.5) : theme.colors.gray[2],
        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.fn.darken(theme.colors.cyan[9], 0.5) : theme.colors.cyan[1],
        },
    },
    cameraImage: {
        width: '100%',
        height: '100%',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    bottomGroup: {
        marginTop: 'auto',
    },
    headText: {
        color: theme.colorScheme === 'dark' ? theme.colors.gray[4] : theme.colors.gray[9],
        fontWeight: 'bold'
    }
}))

interface CameraCardProps {
    camera: GetCameraWHostWConfig
}

const CameraCard = ({
    camera
}: CameraCardProps) => {
    const { t } = useTranslation()
    const [renderImage, setRenderImage] = useState<boolean>(false)
    const { classes } = useStyles();
    const { ref, entry } = useIntersection({ threshold: 0.5, })
    const navigate = useNavigate()
    const hostName = mapHostToHostname(camera.frigateHost)
    const imageUrl = hostName ? proxyApi.cameraImageURL(hostName, camera.name) : '' //todo implement get URL from live cameras
    const { isAdmin } = useAdminRole()


    useEffect(() => {
        if (entry?.isIntersecting)
            setRenderImage(true)
    }, [entry?.isIntersecting])

    const handleOpenLiveView = () => {
        const url = routesPath.LIVE_PATH.replace(':id', camera.id)
        navigate(url)
    }
    const handleOpenRecordings = () => {
        const url = `${routesPath.RECORDINGS_PATH}?${recordingsPageQuery.hostId}=${camera.frigateHost?.id}&${recordingsPageQuery.cameraId}=${camera.id}`
        navigate(url)
    }
    const handleOpenEvents = () => {
        const url = `${routesPath.EVENTS_PATH}?${eventsQueryParams.hostId}=${camera.frigateHost?.id}&${eventsQueryParams.cameraId}=${camera.id}`
        navigate(url)
    }

    const handleOpenEditCamera = () => {
        if (camera.frigateHost) {
            const url = routesPath.EDIT_PATH.replace(':id', camera.id)
            navigate(url)
        }
    }

    return (
        <Grid.Col md={6} lg={3} p='0.2rem'>
            <Card ref={ref} h='100%' radius="lg" padding='0.5rem' className={classes.mainCard}>
                <Text align='center' size='md' className={classes.headText} >{camera.name} / {camera.frigateHost?.name}</Text>
                {!renderImage ? '' :
                    <AutoUpdatedImage onClick={handleOpenLiveView} enabled={camera.config?.enabled} imageUrl={imageUrl} />
                }
                <Group
                    className={classes.bottomGroup}>
                    <Flex justify='space-evenly' mt='0.5rem' w='100%' wrap='wrap' gap="0.2rem">
                        <Button size='sm' onClick={handleOpenRecordings}>{t('recordings')}</Button>
                        <Button size='sm' onClick={handleOpenEvents}>{t('events')}</Button>
                        {!isAdmin ? null : <Button size='sm' onClick={handleOpenEditCamera}>{t('edit')}</Button>}
                    </Flex>
                </Group>
                <CameraTagsList camera={camera} />
            </Card>
        </Grid.Col >
    );
};

export default CameraCard;
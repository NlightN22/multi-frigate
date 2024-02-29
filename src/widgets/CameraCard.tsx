import { Button, Card, Flex, Grid, Group, Text, createStyles } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { recordingsPageQuery } from '../pages/RecordingsPage';
import { routesPath } from '../router/routes.path';
import { mapHostToHostname, proxyApi } from '../services/frigate.proxy/frigate.api';
import { GetCameraWHostWConfig } from '../services/frigate.proxy/frigate.schema';
import AutoUpdatedImage from '../shared/components/images/AutoUpdatedImage';
import { strings } from '../shared/strings/strings';


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
    const { classes } = useStyles();
    const navigate = useNavigate()
    const hostName = mapHostToHostname(camera.frigateHost)
    const imageUrl = hostName ? proxyApi.cameraImageURL(hostName, camera.name) : '' //todo implement get URL from live cameras

    const handleOpenLiveView = () => {
        const url = routesPath.LIVE_PATH.replace(':id', camera.id)
        navigate(url)
    }
    const handleOpenRecordings = () => {
        const url = `${routesPath.RECORDINGS_PATH}?${recordingsPageQuery.hostId}=${camera.frigateHost?.id}&${recordingsPageQuery.cameraId}=${camera.id}`
        navigate(url)
    }
    return (
        <Grid.Col md={6} lg={3} p='0.2rem'>
            <Card h='100%' radius="lg" padding='0.5rem' className={classes.mainCard}>
                <Text align='center' size='md' className={classes.headText} >{camera.name} / {camera.frigateHost?.name}</Text>
                <AutoUpdatedImage onClick={handleOpenLiveView} enabled={camera.config?.enabled} imageUrl={imageUrl} />
                <Group
                    className={classes.bottomGroup}>
                    <Flex justify='space-evenly' mt='0.5rem' w='100%'>
                        <Button size='sm' onClick={handleOpenRecordings}>{strings.recordings}</Button>
                    </Flex>
                </Group>
            </Card>
        </Grid.Col >
    );
};

export default CameraCard;
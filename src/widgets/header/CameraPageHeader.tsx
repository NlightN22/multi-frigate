import { Flex, Button, Text } from '@mantine/core';
import React from 'react';
import { recordingsPageQuery } from '../../pages/RecordingsPage';
import { routesPath } from '../../router/routes.path';
import { GetCameraWHostWConfig } from '../../services/frigate.proxy/frigate.schema';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAdminRole } from '../../hooks/useAdminRole';
import { hostConfigPageQuery } from '../../pages/HostConfigPage';

interface CameraPageHeaderProps {
    camera: GetCameraWHostWConfig
    editButton?: boolean,
    configButton?: boolean,
}

const CameraPageHeader: React.FC<CameraPageHeaderProps> = ({
    camera,
    editButton,
    configButton,
}) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { isAdmin } = useAdminRole()

    const handleOpenRecordings = () => {
        if (camera.frigateHost) {
            const url = `${routesPath.RECORDINGS_PATH}?${recordingsPageQuery.hostId}=${camera.frigateHost.id}&${recordingsPageQuery.cameraId}=${camera.id}`
            navigate(url)
        }
    }

    const handleOpenEditCamera = () => {
        if (camera.frigateHost) {
            const url = routesPath.EDIT_PATH.replace(':id', camera.id)
            navigate(url)
        }
    }

    const hanleOpenConfig = () => {
        if (!camera.frigateHost) return
        const url = routesPath.HOST_CONFIG_PATH.replace(':id', camera.frigateHost.id) + '?' + hostConfigPageQuery.searchWord + '=' + camera.name
        navigate(url)
    }

    return (
        <Flex w='100%' justify='center' align='baseline' mb='0.5rem'>
            <Text mr='1rem'>{t('camera')}: {camera.name} {camera.frigateHost ? `/ ${camera.frigateHost.name}` : ''}</Text>
            {!camera.frigateHost ? null :
                <Button mr='0.5rem' onClick={handleOpenRecordings}>{t('recordings')}</Button>
            }
            {!isAdmin || !editButton ? null :
                <Button mr='0.5rem' onClick={handleOpenEditCamera} >{t('edit')}</Button>
            }
            {!isAdmin || !configButton ? null :
                <Button mr='0.5rem' onClick={hanleOpenConfig} >{t('config')}</Button>
            }
        </Flex>
    );
};

export default CameraPageHeader;
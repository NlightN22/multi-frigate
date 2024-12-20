import { Button, Menu, rem } from '@mantine/core';
import { IconEdit, IconGraph, IconRotateClockwise, IconSettings } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { routesPath } from '../../../router/routes.path';
import { mapHostToHostname, proxyApi } from '../../../services/frigate.proxy/frigate.api';
import { GetFrigateHost } from '../../../services/frigate.proxy/frigate.schema';

interface HostSettingsMenuProps {
    host: GetFrigateHost
}

const HostSettingsMenu = ({ host }: HostSettingsMenuProps) => {
    const {t} = useTranslation()
    const navigate = useNavigate()
    const mutation = useMutation({
        mutationFn: (hostName: string) => proxyApi.getHostRestart(hostName)
    })

    const handleConfig = () => {
        const url = routesPath.HOST_CONFIG_PATH.replace(':id', host.id)
        navigate(url)
    }

    const handleSystem = () => {
        const url = routesPath.HOST_SYSTEM_PATH.replace(':id', host.id)
        navigate(url)
    }

    const handleRestart = () => {
        const hostName = mapHostToHostname(host)
        if (hostName) mutation.mutate(hostName)
    }
    return (
        <Menu shadow="md" width={200}>
            <Menu.Target>
                <Button size='xs' ><IconSettings /></Button>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Item
                    onClick={handleConfig}
                    icon={<IconEdit style={{ width: rem(14), height: rem(14) }} />}>
                    {t('hostMenu.editConfig')}
                </Menu.Item>
                <Menu.Item
                    onClick={handleRestart}
                    icon={<IconRotateClockwise style={{ width: rem(14), height: rem(14) }} />}>
                    {t('hostMenu.restart')}
                </Menu.Item>
                <Menu.Item
                    onClick={handleSystem}
                    icon={<IconGraph style={{ width: rem(14), height: rem(14) }} />}>
                    {t('hostMenu.system')}
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}
export default HostSettingsMenu
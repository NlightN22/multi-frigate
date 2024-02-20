import { Button, Menu, rem, Text } from '@mantine/core';
import { IconEdit, IconGraph, IconMessageCircle, IconRotateClockwise, IconServer, IconSettings } from '@tabler/icons-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { routesPath } from '../../../router/routes.path';

interface HostSettingsMenuProps {
    id: string
}

const HostSettingsMenu = ({ id }: HostSettingsMenuProps) => {
    const navigate = useNavigate()

    const handleConfig = () => {
        const url = routesPath.HOST_CONFIG_PATH.replace(':id', id)
        navigate(url)
    }
    const handleStorage = () => {
        const url = routesPath.HOST_STORAGE_PATH.replace(':id', id)
        navigate(url)
    }
    const handleSystem = () => {
        const url = routesPath.HOST_SYSTEM_PATH.replace(':id', id)
        navigate(url)
    }

    const handleRestart = () => {
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
                    Edit Config
                </Menu.Item>
                <Menu.Item
                    onClick={handleRestart}
                    icon={<IconRotateClockwise style={{ width: rem(14), height: rem(14) }} />}>
                    Restart
                </Menu.Item>
                <Menu.Item
                    onClick={handleSystem}
                    icon={<IconGraph style={{ width: rem(14), height: rem(14) }} />}>
                    System
                </Menu.Item>
                <Menu.Item
                    onClick={handleStorage}
                    icon={<IconServer
                        style={{ width: rem(14), height: rem(14) }} />}>
                    Storage
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}
export default HostSettingsMenu
import { Button, Menu, rem } from '@mantine/core';
import { IconCalendarSearch, IconCamera, IconCameraAi } from '@tabler/icons-react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';


interface OpenArhiveMenuProps {
    onClickMenuItem?(num: number): void
}

const OpenArhiveMenu: FC<OpenArhiveMenuProps> = ({
    onClickMenuItem
}) => {
    const { t } = useTranslation()

    const handleClickMenuItem = (num: number) => {
        if (onClickMenuItem) onClickMenuItem(num)
    }

    return (
        <Menu shadow="md">
            <Menu.Target>
                <Button size='sm' ><IconCalendarSearch /></Button>
            </Menu.Target>
            <Menu.Item
                onClick={() => handleClickMenuItem(0)}
                icon={<IconCameraAi style={{ width: rem(14), height: rem(14) }} />}>
                {t('events')}
            </Menu.Item>
            <Menu.Item
                onClick={() => handleClickMenuItem(1)}
                icon={<IconCamera style={{ width: rem(14), height: rem(14) }} />}>
                {t('recordings')}
            </Menu.Item>
        </Menu>
    );
};

export default OpenArhiveMenu;
import React, { useState } from 'react';
import { Avatar, createStyles, Group, Menu, UnstyledButton, Text, Button, Flex } from "@mantine/core";
import { useAuth } from 'react-oidc-context';
import { strings } from '../strings/strings';
import { useMediaQuery } from '@mantine/hooks';
import { dimensions } from '../dimensions/dimensions';
import ColorSchemeToggle from './ColorSchemeToggle';
import { useNavigate } from 'react-router-dom';
import { keycloakConfig } from '../..';

interface UserMenuProps {
    user: { name: string; image: string }
}

const UserMenu = ({ user }: UserMenuProps) => {
    const [userMenuOpened, setUserMenuOpened] = useState(false);
    const auth = useAuth()
    const isMiddleScreen = useMediaQuery(dimensions.middleScreenSize)
    const navigate = useNavigate()

    const handleAboutMe = () => {
        navigate(`USER_DETAILED_PATH`)
    }

    const handleLogout = async () => {
        await auth.removeUser()
        const id_token_hint = auth.user?.id_token
        await auth.signoutRedirect({ post_logout_redirect_uri: keycloakConfig.redirect_uri, id_token_hint: id_token_hint })
    }

    return (
        <Menu
            width={260}
            transitionProps={{ transition: 'pop-top-right' }}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
        >
            <Menu.Target>
                <Button variant="subtle" uppercase pl={0}>
                    <Group spacing={7}>
                        <Avatar src={user.image} alt={user.name} radius="xl" size={33} mr={5} />
                        <Text weight={600} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                            {user.name}
                        </Text>
                    </Group>
                </Button>
            </Menu.Target>
            <Menu.Dropdown>
                {
                    isMiddleScreen ?
                        <Flex w='100%' justify='space-between' align='center'>
                            <Text fz='sm' ml='0.7rem'>{strings.changeTheme}</Text>
                            <ColorSchemeToggle />
                        </Flex>
                        :
                        <></>
                }
                <Menu.Item>
                    {strings.settings}
                </Menu.Item>
                <Menu.Item onClick={handleAboutMe}>
                    {strings.aboutMe}
                </Menu.Item>
                <Menu.Item onClick={handleLogout}>
                    {strings.logout}
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
};

export default UserMenu;
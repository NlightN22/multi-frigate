import { Avatar, Button, Flex, Group, Menu, Text } from "@mantine/core";
import { useMediaQuery } from '@mantine/hooks';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { keycloakConfig } from '../..';
import { dimensions } from '../dimensions/dimensions';
import ColorSchemeToggle from './buttons/ColorSchemeToggle';

interface UserMenuProps {
    user: { name: string; image: string }
}

const UserMenu = ({ user }: UserMenuProps) => {

    const { t, i18n } = useTranslation()

    const languages = [
        { lng: 'en', name: 'Eng' },
        { lng: 'ru', name: 'Rus' },
    ]

    const auth = useAuth()
    const isMiddleScreen = useMediaQuery(dimensions.middleScreenSize)



    const handleLogout = async () => {
        await auth.removeUser()
        const id_token_hint = auth.user?.id_token
        await auth.signoutRedirect({ post_logout_redirect_uri: keycloakConfig.redirect_uri, id_token_hint: id_token_hint })
    }

    const handleChangeLanguage = async (lng: string) => {
        await i18n.changeLanguage(lng)
    }

    const languageSelector = useCallback(() => {
        return languages.map(lang => (
            <Button
                key={lang.lng}
                size='xs'
                component="a"
                variant="outline"
                disabled={i18n.resolvedLanguage === lang.lng}
                onClick={() => handleChangeLanguage(lang.lng)}>
                {lang.name}
            </Button>
        ))
    }, [i18n.resolvedLanguage])

    return (
        <Menu
            width={260}
            transitionProps={{ transition: 'pop-top-right' }}
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
                            <Text fz='sm' ml='0.7rem'>{t('changeTheme')}</Text>
                            <ColorSchemeToggle />
                        </Flex>
                        :
                        <></>
                }
                {
                    languageSelector()
                }
                <Menu.Item onClick={handleLogout}>
                    {t('logout')}
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
};

export default UserMenu;
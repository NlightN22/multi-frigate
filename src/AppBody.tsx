import { AppShell, useMantineTheme, } from "@mantine/core";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from "react-router-dom";
import AppRouter from './router/AppRouter';
import { routesPath } from './router/routes.path';
import RightSideBar from "./shared/components/RightSideBar";
import { isProduction } from './shared/env.const';
import { HeaderAction } from './widgets/header/HeaderAction';

const AppBody = () => {
    const { t } = useTranslation()

    const headerLinks = [
        { link: routesPath.MAIN_PATH, label: t('header.home') },
        { link: routesPath.SETTINGS_PATH, label: t('header.settings'), admin: true },
        { link: routesPath.RECORDINGS_PATH, label: t('header.recordings') },
        { link: routesPath.EVENTS_PATH, label: t('header.events') },
        { link: routesPath.HOSTS_PATH, label: t('header.hostsConfig'), admin: true },
        { link: routesPath.ACCESS_PATH, label: t('header.acessSettings'), admin: true },
    ]

    const location = useLocation()

    const pathsWithLeftSidebar: string[] = []
    const pathsWithRightSidebar: string[] = [routesPath.MAIN_PATH, routesPath.RECORDINGS_PATH, routesPath.EVENTS_PATH]

    const [isLeftSideBarVisible, setVisibleLeftSidebar] = useState(pathsWithLeftSidebar.includes(location.pathname))
    const [isRightSideBarVisible, setVisibleRightSidebar] = useState(pathsWithRightSidebar.includes(location.pathname))

    const handleRightSidebarChange = (isVisible: boolean) => {
        setVisibleRightSidebar(isVisible);
    };

    const theme = useMantineTheme();

    if (!isProduction) console.log("render AppBody")
    return (
        <AppShell
            styles={{
                main: {
                    paddingLeft: !isLeftSideBarVisible ? "1rem" : '',
                    paddingRight: !isRightSideBarVisible ? '1rem' : '',
                    background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : undefined,
                },
            }}
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"

            header={
                <HeaderAction links={headerLinks} />
            }

            aside={
                !pathsWithRightSidebar.includes(location.pathname) ? <></> :
                    <RightSideBar onChangeHidden={handleRightSidebarChange}/>
            }
        >
            <AppRouter />
        </AppShell>
    )
};

export default AppBody;
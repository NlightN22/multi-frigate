import { AppShell, useMantineTheme, } from "@mantine/core";
import { observer } from 'mobx-react-lite';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Context } from '.';
import AppRouter from './router/AppRouter';
import { routesPath } from './router/routes.path';
import { isProduction } from './shared/env.const';
import { HeaderAction } from './widgets/header/HeaderAction';
import RightSideBar from "./shared/components/RightSideBar";
import { useLocation } from "react-router-dom";

const AppBody = () => {
    const { t } = useTranslation()

    const headerLinks = [
        { link: routesPath.MAIN_PATH, label: t('header.home') },
        { link: routesPath.SETTINGS_PATH, label: t('header.settings'), admin: true },
        { link: routesPath.RECORDINGS_PATH, label: t('header.recordings') },
        { link: routesPath.HOSTS_PATH, label: t('header.hostsConfig'), admin: true },
        { link: routesPath.ACCESS_PATH, label: t('header.acessSettings'), admin: true },
    ]


    const location = useLocation()

    const pathsWithLeftSidebar: string[] = []
    const pathsWithRightSidebar: string[] = [routesPath.MAIN_PATH, routesPath.RECORDINGS_PATH]

    const [leftSideBar, setLeftSidebar] = useState(pathsWithLeftSidebar.includes(location.pathname))
    const [rightSideBar, setRightSidebar] = useState(pathsWithRightSidebar.includes(location.pathname))

    const handleRightSidebarChange = (isVisible: boolean) => {
        setRightSidebar(isVisible);
    };

    const theme = useMantineTheme();


    if (!isProduction) console.log("render Main")
    return (
        <AppShell
            styles={{
                main: {
                    paddingLeft: !leftSideBar ? "1rem" : '',
                    paddingRight: !rightSideBar ? '1rem' : '',
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

export default observer(AppBody);
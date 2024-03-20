import { AppShell, useMantineTheme, } from "@mantine/core";
import { observer } from 'mobx-react-lite';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Context } from '.';
import AppRouter from './router/AppRouter';
import { routesPath } from './router/routes.path';
import SideBar from './shared/components/SideBar';
import { isProduction } from './shared/env.const';
import { HeaderAction } from './widgets/header/HeaderAction';
import { useAdminRole } from "./hooks/useAdminRole";
import { useRealmAccessRoles } from "./hooks/useRealmAccessRoles";

const AppBody = () => {
    const { t } = useTranslation()

    const headerLinks = [
        { link: routesPath.MAIN_PATH, label: t('header.home') },
        { link: routesPath.SETTINGS_PATH, label: t('header.settings'), admin: true },
        { link: routesPath.RECORDINGS_PATH, label: t('header.recordings') },
        { link: routesPath.HOSTS_PATH, label: t('header.hostsConfig'), admin: true },
        { link: routesPath.ACCESS_PATH, label: t('header.acessSettings'), admin: true },
    ]

    const { sideBarsStore } = useContext(Context)

    const [leftSideBar, setLeftSidebar] = useState(false)
    const [rightSideBar, setRightSidebar] = useState(false)

    const leftSideBarIsHidden = (isHidden: boolean) => {
        setLeftSidebar(!isHidden)
    }
    const rightSideBarIsHidden = (isHidden: boolean) => {
        setRightSidebar(!isHidden)
    }

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
                !sideBarsStore.rightVisible ? <></> :
                    <SideBar isHidden={rightSideBarIsHidden} side="right" />
            }
        >
            <AppRouter />
        </AppShell>
    )
};

export default observer(AppBody);
import React, { useContext, useState } from 'react';
import { AppShell, useMantineTheme, } from "@mantine/core"
import { HeaderAction } from './widgets/header/HeaderAction';
import { headerLinks } from './widgets/header/header.links';
import AppRouter from './router/AppRouter';
import { Context } from '.';
import SideBar from './shared/components/SideBar';
import { observer } from 'mobx-react-lite';

const AppBody = () => {

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

    console.log("render Main")
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
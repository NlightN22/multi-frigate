import React, { useEffect, useState } from 'react';
import { AppShell, useMantineTheme, } from "@mantine/core"
import LeftSideBar from './widgets/LeftSideBar';
import RightSideBar from './widgets/RightSideBar';
import { HeaderAction } from './widgets/header/HeaderAction';
import { testHeaderLinks } from './widgets/header/header.links';
import AppRouter from './router/AppRouter';
import { SideBar } from './shared/components/SideBar';

const AppBody = () => {
    useEffect(() => {
        console.log("render Main")
    })

    const [leftSideBar, setLeftSidebar] = useState(true)
    const [rightSideBar, setRightSidebar] = useState(true)


    const leftSideBarIsHidden = (isHidden: boolean) => {
        setLeftSidebar(!isHidden)
    }

    const theme = useMantineTheme();

    return (
        <AppShell
            styles={{
                main: {
                    paddingLeft: !leftSideBar ? "3em" : '',
                    paddingRight: !rightSideBar ? '3em' : '',
                    background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : undefined,
                },
            }}
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"

            header={
                <HeaderAction links={testHeaderLinks.links} />
            }
            navbar={
                <SideBar isHidden={leftSideBarIsHidden} side="left" />
            }
        >
            <AppRouter />
        </AppShell>
    )
};

export default AppBody;
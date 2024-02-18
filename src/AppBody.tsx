import React, { useEffect, useState } from 'react';
import { AppShell, useMantineTheme, } from "@mantine/core"
import { HeaderAction } from './widgets/header/HeaderAction';
import { testHeaderLinks } from './widgets/header/header.links';
import AppRouter from './router/AppRouter';
import { SideBar } from './shared/components/SideBar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient()

const AppBody = () => {
    useEffect(() => {
        console.log("render Main")
    })

    const [leftSideBar, setLeftSidebar] = useState(false)
    const [rightSideBar, setRightSidebar] = useState(false)


    const leftSideBarIsHidden = (isHidden: boolean) => {
        setLeftSidebar(!isHidden)
    }
    const rightSideBarIsHidden = (isHidden: boolean) => {
        setRightSidebar(!isHidden)
    }

    const theme = useMantineTheme();

    return (
        <QueryClientProvider client={queryClient}>
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
                aside={
                    <SideBar isHidden={rightSideBarIsHidden} side="right" />
                }
            >
                <AppRouter />
            </AppShell>
        </QueryClientProvider>
    )
};

export default AppBody;
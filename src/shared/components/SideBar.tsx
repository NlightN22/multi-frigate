import { Aside, Button, Navbar, createStyles } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Context } from '../..';
import { dimensions } from '../dimensions/dimensions';
import { strings } from '../strings/strings';
import { useMantineSize } from '../utils/mantine.size.convertor';
import { SideButton } from './SideButton';

export interface SideBarProps {
    isHidden: (isHidden: boolean) => void,
    side: 'left' | 'right',
    children?: React.ReactNode,
}

const useStyles = createStyles((theme,
    { visible }: { visible: boolean }) => ({
        navbar: {
            transition: 'transform 0.3s ease-in-out',
            transform: visible ? 'translateX(0)' : 'translateX(-100%)',
        },

        aside: {
            transition: 'transform 0.3s ease-in-out',
            transform: visible ? 'translateX(0)' : 'translateX(+100%)',
        },
    }))


const SideBar = ({ isHidden, side, children }: SideBarProps) => {
    const hideSizePx = useMantineSize(dimensions.hideSidebarsSize)
    const initialVisible = () => {
        const savedVisibility = localStorage.getItem(`sidebarVisible_${side}`);
        if (savedVisibility === null) {
            return window.innerWidth < hideSizePx;
        }
        return savedVisibility === 'true';
    }
    const [visible, { open, close }] = useDisclosure(initialVisible());

    const { classes } = useStyles({ visible })

    const handleClickVisible = (state: boolean) => {
        localStorage.setItem(`sidebarVisible_${side}`, String(state))
        if (state) open()
        else close()
    }

    const { sideBarsStore } = useContext(Context)
    useEffect(() => {
        if (sideBarsStore.rightVisible && side === 'right' && !visible) {
            open()
        } else if (!sideBarsStore.rightVisible && side === 'right' && visible) {
            close()
        }
    }, [sideBarsStore.rightVisible])

    const [leftChildren, setLeftChildren] = useState<React.ReactNode>(() => {
        if (children && side === 'left') return children
        else if (sideBarsStore.leftChildren) return sideBarsStore.leftChildren
        return null
    })
    const [rightChildren, setRightChildren] = useState<React.ReactNode>(() => {
        if (children && side === 'right') return children
        else if (sideBarsStore.rightChildren) return sideBarsStore.rightChildren
        return null
    })

    useEffect(() => {
        setLeftChildren(sideBarsStore.leftChildren)
    }, [sideBarsStore.leftChildren])

    useEffect(() => {
        setRightChildren(sideBarsStore.rightChildren)
    }, [sideBarsStore.rightChildren])

    useEffect(() => {
        isHidden(!visible)
    }, [visible])

    useEffect(() => {
        const savedVisibility = localStorage.getItem(`sidebarVisible_${side}`);
        if (savedVisibility === null && window.innerWidth < hideSizePx) {
            open()
        } else if (savedVisibility) {
            savedVisibility === 'true' ? open() : close()
        }
    }, [])

    return (
        <div>
            {
                side === 'left' ?
                    <Navbar
                        className={classes.navbar}
                        p={dimensions.hideSidebarsSize}
                        width={{ sm: 200, lg: 300, }}
                    >
                        <Button onClick={() => handleClickVisible(false)}>{strings.hide}</Button>
                        {leftChildren}
                    </Navbar>
                    :
                    <Aside
                        className={classes.aside}
                        p={dimensions.hideSidebarsSize}
                        width={{ sm: 200, lg: 300 }}>
                        <Button onClick={() => handleClickVisible(false)}>{strings.hide}</Button>
                        {rightChildren}
                    </Aside>
            }
            <SideButton side={side} hide={visible} onClick={() => handleClickVisible(true)} />
        </div>
    )
}

export default observer(SideBar)
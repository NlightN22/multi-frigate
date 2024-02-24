import React, { FC, JSX, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Aside, Button, createStyles, Navbar } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMantineSize } from '../utils/mantine.size.convertor';
import { SideButton } from './SideButton';
import { strings } from '../strings/strings';
import { dimensions } from '../dimensions/dimensions';
import { Context } from '../..';
import { observer } from 'mobx-react-lite';

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
    const [visible, { open, close }] = useDisclosure(window.innerWidth > hideSizePx);
    const manualVisible: React.MutableRefObject<null | boolean> = useRef(null)

    const { classes } = useStyles({ visible })

    const handleClickVisible = (state: boolean) => {
        manualVisible.current = state
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

    // resize controller
    useEffect(() => {
        const checkWindowSize = () => {
            if (window.innerWidth <= hideSizePx && visible) {
                close()
            }
            if (window.innerWidth > hideSizePx && !visible && manualVisible.current === null) {
                open()
            }
        }
        window.addEventListener('resize', checkWindowSize);

        // Cleanup function to remove event listener
        return () => {
            window.removeEventListener('resize', checkWindowSize);
        }
    }, [visible])

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
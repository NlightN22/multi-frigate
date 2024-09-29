import { Aside, Button, createStyles } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { t } from 'i18next';
import React, { useContext } from 'react';
import { SideBarContext } from '../../widgets/sidebars/SideBarContext';
import { dimensions } from '../dimensions/dimensions';
import { useMantineSize } from '../utils/mantine.size.convertor';
import { SideButton } from './SideButton';


interface RightSideBarProps {
    onChangeHidden?: (isHidden: boolean) => void,
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


const RightSideBar = ({ onChangeHidden, children }: RightSideBarProps) => {

    const side = 'right'

    const hideSizePx = useMantineSize(dimensions.hideSidebarsSize)

    const [visible, { open, close }] = useDisclosure(true);

    const { classes } = useStyles({ visible })

    const { childrenComponent } = useContext(SideBarContext);

    const handleClickVisible = (state: boolean) => {
        if (state) open()
        else close()
        if (onChangeHidden) onChangeHidden(state)
    }

    return (<div>
        <Aside
            className={classes.aside}
            p={dimensions.hideSidebarsSize}
            width={{ sm: 200, lg: 300 }}>
            <Button onClick={() => handleClickVisible(false)}>{t('hide')}</Button>
            {childrenComponent}
        </Aside>
        <SideButton side={side} hide={visible} onClick={() => handleClickVisible(true)} />
    </div>
    );
};

export default RightSideBar;
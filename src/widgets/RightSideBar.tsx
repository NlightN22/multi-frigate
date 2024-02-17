import React from 'react';
import { SideBar, SideBarProps } from '../shared/components/SideBar';
import { Text } from '@mantine/core';
import { v4 as uuidv4 } from 'uuid'


interface RightSideBarProps {
    isHidden: (isHidden: boolean) => void
}

const RightSideBar = ({ isHidden }: RightSideBarProps) => {
    return (
        <SideBar isHidden={isHidden} side="right">
        </SideBar>
    );
};

export default RightSideBar;
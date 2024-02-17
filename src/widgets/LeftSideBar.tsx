import React from 'react';
import { SideBar, SideBarProps, } from '../shared/components/SideBar';


interface LeftSideBarProps {
    isHidden: (isHidden: boolean) => void
}

const LeftSideBar = ({ isHidden }: LeftSideBarProps) => {
    return (
        <SideBar isHidden={isHidden} side="left" />
    );
};

export default LeftSideBar;
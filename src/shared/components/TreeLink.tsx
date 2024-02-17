import { NavLink } from '@mantine/core';
import React from 'react';

interface TreeLinkProps {
    id: string
    label: string
    selected: boolean,
    opened?: boolean,
    onClick(selectedId: string): void,
    children?: (JSX.Element | undefined)[]
}
const TreeLink = ({id, label, selected, opened, onClick, children}: TreeLinkProps) => {

    return (
        <NavLink
            opened={opened}
            pt='2px'
            pb='2px'
            active={selected}
            label={label}
            childrenOffset={18}
            onClick={() => onClick(id)}
            defaultOpened={false}
            >
            {children}
        </NavLink>
    );
};

export default TreeLink;
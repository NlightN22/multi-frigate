import { Center, Text, TextProps, Tooltip } from '@mantine/core';
import { IconChevronDown, IconChevronUp, IconSelector, } from '@tabler/icons-react';
import React from 'react';

interface SortedThProps {
    title: string,
    reversed: boolean,
    sortedName: string | null,
    textProps?: TextProps
    sorting?: boolean
    onSort: (title: string) => void,
}

const SortedTh = ({ sortedName, reversed, title, onSort, textProps, sorting=true }: SortedThProps) => {
    const sorted = sortedName === title
    const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
    const handleClick = () => {
        if (sorting) onSort(title)
    }
    return (
        <th style={{paddingLeft: 5, paddingRight: 5}}>
            <Center onClick={handleClick}>
                <Tooltip label={title} transitionProps={{ transition: 'slide-up', duration: 300 }} openDelay={500}>
                    <Text {...textProps}>{title}</Text>
                </Tooltip>
                {
                    sorting ? <Icon /> : null
                }
            </Center>
        </th>
    );
};

export default SortedTh;
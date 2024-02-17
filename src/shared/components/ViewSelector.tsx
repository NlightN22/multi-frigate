import { Center, SegmentedControl } from '@mantine/core';
import { IconColumns, IconLayoutGrid } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';

export enum SelectorViewState {
    TABLE = "table",
    GRID = "grid",
}

interface ViewSelectorProps {
    state: SelectorViewState
    onChange(state: SelectorViewState): void
}

const ViewSelector = ({state, onChange} : ViewSelectorProps) => {

    const handleToggle = ( value: string ) => {
        onChange(value as SelectorViewState)
    }

    return (
        <SegmentedControl
        value={state}
        onChange={handleToggle}
        data={[
            {
                value: SelectorViewState.TABLE,
                label: (
                <Center>
                    <IconColumns />
                </Center>
            )},
            {
                value: SelectorViewState.GRID,
                label: (
                <Center>
                    <IconLayoutGrid />
                </Center>
            )},
        ]}
        />
    );
};

export default ViewSelector;
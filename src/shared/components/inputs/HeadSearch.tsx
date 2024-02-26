import { Flex, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import React from 'react';
import ViewSelector from '../TableGridViewSelector';

interface HeadSearchProps {
    search?: string
    handleSearchChange?(): void
}

const HeadSearch = ({ search, handleSearchChange }: HeadSearchProps) => {
    return (
        <>
            <TextInput
                maw={400}
                style={{ flexGrow: 1 }}
                placeholder="Search..."
                icon={<IconSearch size="0.9rem" stroke={1.5} />}
                value={search}
                onChange={handleSearchChange}
            />
        </>
    );
};

export default HeadSearch;
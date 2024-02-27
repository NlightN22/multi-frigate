import { Flex, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import React, { useState } from 'react';

interface HeadSearchProps {
    search?: string
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const HeadSearch = ({ search, onChange }: HeadSearchProps) => {
    return (
        <TextInput
            maw={400}
            style={{ flexGrow: 1 }}
            placeholder="Search..."
            icon={<IconSearch size="0.9rem" stroke={1.5} />}
            value={search}
            onChange={onChange}
        />
    );
};

export default HeadSearch;
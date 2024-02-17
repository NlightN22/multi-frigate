import { Grid, Flex, Text } from '@mantine/core';
import React from 'react';
import { strings } from '../../strings/strings';

interface ProfileRowProps {
    name?: string
    value?: string
}

const ProfileRow = ({ name, value }: ProfileRowProps) => {
    return (
        <>
            <Grid.Col span={6}>
                <Text fz='md'>{name}</Text>
            </Grid.Col>
            <Grid.Col span={6}>
                <Text align='center' fz='md'>{value}</Text>
            </Grid.Col>
        </>
    );
};

export default ProfileRow;
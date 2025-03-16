import { Badge, Flex } from '@mantine/core';
import React from 'react';

import packageJson from '../../../package.json';

const VersionTag = () => {
    return (
        <Flex
        direction='column'
        align='end'
        >
            <Badge
                mt='0.2rem'
                mr='0.3rem'
                variant="outline"
                pr={3}
            >
                v.{packageJson.version}
            </Badge>
        </Flex>
    );
};

export default VersionTag;
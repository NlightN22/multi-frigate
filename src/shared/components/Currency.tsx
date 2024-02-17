import React from 'react';
import { Text, TextProps } from '@mantine/core'
import { strings } from '../strings/strings';

const Currency = (props: TextProps) => {
    return (
        <Text pl='0.2rem' fz="md" fw={500} {...props} >
        {strings.currency}
      </Text>
    );
};

export default Currency;
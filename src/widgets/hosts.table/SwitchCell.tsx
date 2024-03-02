import { Flex, Switch, useMantineTheme } from '@mantine/core';
import { IconBulbFilled, IconBulbOff } from '@tabler/icons-react';
import React from 'react';
import { boolean } from 'zod';

interface SwithCellProps {
    value?: boolean,
    defaultValue?: boolean,
    width?: string,
    id?: string | number,
    propertyName?: string,
    toggle?: (id: string | number, propertyName: string, value: string) => void,
}

export const SwitchCell = ( { value, defaultValue, width, id, propertyName, toggle }: SwithCellProps ) => {
    const theme = useMantineTheme();

    if (typeof value !== 'boolean') value = defaultValue
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (id && toggle && propertyName) toggle(id, propertyName, event.target.value)
    }
    return (
        <td style={{ width: width }}>
            <Flex w='100%' justify='center'>
                <Switch
                    checked={value}
                    onChange={handleChange}
                    size="lg"
                    onLabel={<IconBulbFilled color={theme.colors.green[5]} size="1.25rem" stroke={1.5} />}
                    offLabel={<IconBulbOff color={theme.colors.gray[6]} size="1.25rem" stroke={1.5} />}
                />
            </Flex>
        </td>
    )
}

export default SwitchCell;
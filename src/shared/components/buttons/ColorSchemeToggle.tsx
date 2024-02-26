import { useMantineColorScheme, useMantineTheme, Switch,  MantineStyleSystemProps, DefaultProps } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';
import React from 'react';

interface ColorSchemeToggleProps extends MantineStyleSystemProps, DefaultProps {}


const ColorSchemeToggle = ( props: ColorSchemeToggleProps ) => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const theme = useMantineTheme();
    return (
        <Switch
          {...props}
          checked={colorScheme === 'dark'}
          onChange={() => toggleColorScheme()}
          size="lg"
          onLabel={<IconSun color={theme.white} size="1.25rem" stroke={1.5} />}
          offLabel={<IconMoonStars color={theme.colors.gray[6]} size="1.25rem" stroke={1.5} />}
        />
    );
};

export default ColorSchemeToggle;
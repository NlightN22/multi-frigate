import { ActionIcon, Badge, Button, Menu, rem } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { frigateQueryKeys, frigateApi } from '../../services/frigate.proxy/frigate.api';
import CogwheelLoader from './loaders/CogwheelLoader';
import RetryError from './RetryError';

interface AddBadgeProps {
    onClick?(tagId: string): void,
}


const AddBadge: React.FC<AddBadgeProps> = ({
    onClick
}) => {

    const { data, isPending, isError, refetch } = useQuery({
        queryKey: [frigateQueryKeys.getUserTags],
        queryFn: frigateApi.getUserTags
    })

    const handleClick = (tagId: string) => {
        if (onClick) onClick(tagId)
    }

    if (isPending) return <CogwheelLoader />
    if (isError) return <RetryError onRetry={refetch} />

    if (!data || data.length < 1) return (
        <Badge
            mt='0.2rem'
            variant="outline"
        >
            <ActionIcon size="xs" color="blue" radius="xl" variant="transparent">
                <IconPlus size={rem(20)} />
            </ActionIcon>
        </Badge>
    )


    return (
        <Menu
            shadow="md"
            width={200}
            transitionProps={{ transition: 'pop-top-right' }}
            position="top-end"
            withinPortal
        >
            <Menu.Target>
                <Badge
                    mt='0.2rem'
                    variant="outline"
                >
                    <ActionIcon size="xs" color="blue" radius="xl" variant="transparent">
                        <IconPlus size={rem(20)} />
                    </ActionIcon>
                </Badge>
            </Menu.Target>
            <Menu.Dropdown>
                {data.map((item) => (
                    <Menu.Item key={item.id} onClick={() => handleClick(item.id)}>
                        {item.value}
                    </Menu.Item>
                ))}
            </Menu.Dropdown>
        </Menu>
    );
};

export default AddBadge;
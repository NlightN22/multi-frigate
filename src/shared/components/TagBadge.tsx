import { ActionIcon, rem, Badge } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import React from 'react';

const RemoveButton = ({ onClick }: { onClick(): void }) => {
    return (
        <ActionIcon onClick={onClick} size="xs" color="blue" radius="xl" variant="transparent">
            <IconX size={rem(10)} />
        </ActionIcon>
    );
};

interface TagBadgeProps {
    value: string,
    label: string,
    onClick?(value: string): void,
    onClose?(value: string): void,
}

const TagBadge: React.FC<TagBadgeProps> = ({
    value,
    label,
    onClick,
    onClose,
}) => {

    const handleClick = (value: string) => {
        if (onClick) onClick(value)
    }

    const handleClose = () => {
        if (onClose) onClose(value)
    }

    return (
        <Badge
            mt='0.2rem'
            mr='0.3rem'
            variant="outline"
            pr={3}
            rightSection={<RemoveButton onClick={handleClose} />}
            onClick={() => handleClick}
        >
            {label}
        </Badge>
    );
};

export default TagBadge;
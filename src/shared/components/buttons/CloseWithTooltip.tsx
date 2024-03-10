import { Tooltip, CloseButton, CloseButtonProps } from '@mantine/core';
import React from 'react';


interface CloseWithTooltipProps {
    label: string
    onClose?(): void
    buttonProps?: CloseButtonProps
}


const CloseWithTooltip = ({ label, onClose, buttonProps }: CloseWithTooltipProps) => {

    return (
        <Tooltip label={label} transitionProps={{ transition: 'slide-up', duration: 300 }} openDelay={200}>
            <CloseButton {...buttonProps} onClick={onClose} />
        </Tooltip>
    );
};

export default CloseWithTooltip;
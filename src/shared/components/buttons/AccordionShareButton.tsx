import { useClipboard } from '@mantine/hooks';
import { IconShare } from '@tabler/icons-react';
import React from 'react';
import AccordionControlButton from './AccordionControlButton';
import { routesPath } from '../../../router/routes.path';

interface AccordionShareButtonProps {
    recordUrl?: string
}

const AccordionShareButton = ({
    recordUrl
}: AccordionShareButtonProps) => {
    const canShare = Boolean(navigator.share);
    const clipboard = useClipboard()
    const url = recordUrl ? `${routesPath.PLAYER_PATH}?link=${encodeURIComponent(recordUrl)}` : ''

    const handleShare = async () => {
        if (canShare && url) {
            try {
                await navigator.share({ url });
                console.log('Content shared successfully');
            } catch (err) {
                console.error('Error sharing content: ', err);
            }
        } else {
            clipboard.copy(url)
            console.log('URL copied to clipboard')
        }
    }

    return (
        <AccordionControlButton>
            <IconShare onClick={handleShare} />
        </AccordionControlButton>
    );
};

export default AccordionShareButton;
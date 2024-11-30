import { Button } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { t } from 'i18next';
import { FC } from 'react';

interface DownloadButtonProps {
    link?: string
    onClick?(): void
}

const DownloadButton: FC<DownloadButtonProps> = ({
    link,
    onClick
}) => {

    const handleOnClick = () => {
        if (onClick) onClick()
    }
    return (
        <Button
            component="a"
            href={link}
            download
            variant="outline"
            leftIcon={<IconDownload size="0.9rem" />}
            onClick={handleOnClick}
        >
            {t('download')}
        </Button>
    );
};

export default DownloadButton;
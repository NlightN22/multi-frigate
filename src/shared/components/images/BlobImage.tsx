import { Image, ImageProps, Loader } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { proxyApi } from '../../../services/frigate.proxy/frigate.api';
import RetryError from '../RetryError';

export interface BlobImageProps extends ImageProps {
    src: string
    refetchOnError?: boolean
}

const BlobImage = ({
    src,
    refetchOnError,
    ...rest
}: BlobImageProps) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    const { data: imageBlob, refetch, isPending, isError } = useQuery({
        queryKey: [src],
        queryFn: () => proxyApi.getImageFrigate(src),
        staleTime: Infinity,
        gcTime: Infinity,
    });

    useEffect(() => {
        if (imageBlob && imageBlob instanceof Blob) {
            const objectURL = URL.createObjectURL(imageBlob);
            setImageSrc(objectURL);

            return () => {
                if (objectURL) {
                    URL.revokeObjectURL(objectURL);
                }
            }
        }
    }, [imageBlob])

    if (isPending || !imageSrc) return <Loader />

    if (isError && refetchOnError) {
        refetch()
    } else if (isError) {
        return <RetryError onRetry={refetch} />
    }

    return (
        <Image src={imageSrc} {...rest} />
    );
};

export default BlobImage;
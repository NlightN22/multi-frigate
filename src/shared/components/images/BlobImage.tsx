import { Image, ImageProps, Loader } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { proxyApi } from '../../../services/frigate.proxy/frigate.api';
import { useIntersection } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import RetryError from '../RetryError';

interface BlobImageProps extends ImageProps {
    src: string
}

const BlobImage = ({
    src,
    ...rest
}: BlobImageProps) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    const { ref, entry } = useIntersection({ threshold: 0.1, })
    const isVisible = entry?.isIntersecting

    const { data: imageBlob, refetch, isPending, isError } = useQuery({
        queryKey: [src],
        queryFn: () => proxyApi.getImageFrigate(src),
        staleTime: 60 * 1000,
        gcTime: Infinity,
        refetchInterval: isVisible ? 30 * 1000 : undefined,
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

    if (isError) return <RetryError onRetry={refetch} />

    return (
        <Image src={imageSrc} {...rest} />
    );
};

export default BlobImage;
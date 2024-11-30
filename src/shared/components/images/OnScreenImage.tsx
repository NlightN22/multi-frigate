import { useIntersection } from '@mantine/hooks';
import { FC, useEffect, useState } from 'react';
import BlobImage, { BlobImageProps } from './BlobImage';

const OnScreenImage: FC<BlobImageProps> = ({
    ...rest
}) => {
    const [renderImage, setRenderImage] = useState<boolean>(false)
    const { ref, entry } = useIntersection({ threshold: 0.1, })

    useEffect(() => {
        if (entry?.isIntersecting)
            setRenderImage(true)
    }, [entry?.isIntersecting])

    return (
        <div ref={ref}>
            {!renderImage ? null :
                <BlobImage {...rest}/>
            }

        </div>
    );
};

export default OnScreenImage;
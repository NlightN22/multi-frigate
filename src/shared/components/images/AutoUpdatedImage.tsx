import { useEffect, useRef, useState } from "react";
import { CameraConfig } from "../../../types/frigateConfig";
import { Flex, Text, Image } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { frigateApi, proxyApi } from "../../../services/frigate.proxy/frigate.api";
import { useIntersection } from "@mantine/hooks";
import CogwheelLoader from "../loaders/CogwheelLoader";
import RetryError from "../RetryError";

interface AutoUpdatedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
  cameraConfig?: CameraConfig;
  onload?: () => void;
  imageUrl: string;
  enabled?: boolean;
}

const AutoUpdatedImage = ({
  imageUrl,
  enabled,
  ...rest
}: AutoUpdatedImageProps) => {
  const { ref, entry } = useIntersection({ threshold: 0.1, })
  const isVisible = entry?.isIntersecting
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const { data: imageBlob, refetch, isPending, isError } = useQuery({
    queryKey: [imageUrl],
    queryFn: () => proxyApi.getImageFrigate(imageUrl, 522),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchInterval: isVisible ? 30 * 1000 : undefined,
    retry: 1,
  });

  useEffect(() => {
    if (isVisible) {
      const intervalId = setInterval(() => {
        refetch()
      }, 60 * 1000)
      return () => clearInterval(intervalId);
    }
  }, [refetch, isVisible])

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

  if (isPending) return <CogwheelLoader />

  if (isError) return (
    <Flex direction="column" justify="center" h="100%">
      <RetryError onRetry={refetch}/>
    </Flex>
  )

  if (!imageSrc) return null

  return (
    <Flex direction="column" justify="center" h="100%">
      {enabled ? <Image ref={ref} src={imageSrc} alt="Dynamic Content" {...rest} withPlaceholder />
        :
        <Text align="center">Camera is disabled in config, no stream or snapshot available!</Text>
      }
    </Flex>)
};

export default AutoUpdatedImage
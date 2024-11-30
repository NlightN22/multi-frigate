import { Flex, Image, Text } from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { proxyApi } from "../../../services/frigate.proxy/frigate.api";
import { CameraConfig } from "../../../types/frigateConfig";
import { isProduction } from "../../env.const";
import CogwheelLoader from "../loaders/CogwheelLoader";

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
    queryFn: () => {
      if (enabled) return proxyApi.getImageFrigate(imageUrl, 522)
      return null
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchInterval: isVisible ? 60 * 1000 : undefined,
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

  if (!enabled) return <Text align="center">Camera is disabled in config, no stream or snapshot available!</Text>

  if (isPending || !imageSrc) return <CogwheelLoader />

  if (!isProduction) console.log('AutoUpdatedImage rendered')

  return (
    <Flex direction="column" justify="center" h="100%">
      <Image ref={ref} src={imageSrc} alt="Dynamic Content" {...rest} withPlaceholder />
    </Flex>)
};

export default AutoUpdatedImage
import { useEffect, useRef } from "react";
import { CameraConfig } from "../../types/frigateConfig";
import { Flex, Text, Image } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { frigateApi, proxyApi } from "../../services/frigate.proxy/frigate.api";
import { useIntersection } from "@mantine/hooks";
import CogwheelLoader from "./loaders/CogwheelLoader";

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

  const { data: imageBlob, refetch, isPending, isError } = useQuery({
    queryKey: ['image', imageUrl],
    queryFn: () => proxyApi.getImageFrigate(imageUrl),
    staleTime: 60 * 1000,
    gcTime: Infinity,
    refetchInterval: isVisible ? 30 * 1000 : undefined,
  });

  useEffect(() => {
    if (isVisible) {
      const intervalId = setInterval(() => {
        refetch();
      }, 60 * 1000);
      return () => clearInterval(intervalId);
    }
  }, [refetch, isVisible]);

  if (isPending) return <CogwheelLoader />

  if (isError) return (
    <Flex direction="column" justify="center" h="100%">
      <Text align="center">Error loading!</Text>
    </Flex>
  )

  if (!imageBlob || !(imageBlob instanceof Blob)) console.error('imageBlob not Blob object:', imageBlob)

  const image = URL.createObjectURL(imageBlob!)

  return (
    <Flex direction="column" justify="center" h="100%">
      {enabled ? <Image ref={ref} src={image} alt="Dynamic Content" {...rest} />
        :
        <Text align="center">Camera is disabled in config, no stream or snapshot available!</Text>
      }
    </Flex>)
};

export default AutoUpdatedImage
import { useEffect, useRef } from "react";
import { CameraConfig } from "../../../types/frigateConfig";
import { AspectRatio, Flex, createStyles, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import CenterLoader from "../CenterLoader";
import axios from "axios";
import { frigateApi, proxyApi } from "../../../services/frigate.proxy/frigate.api";

interface CameraImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
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
}: CameraImageProps) => {
  const { data: imageBlob, refetch, isPending, isError } = useQuery({
    queryKey: ['image', imageUrl],
    queryFn: () => proxyApi.getImageFrigate(imageUrl),
    staleTime: 60 * 1000,
    gcTime: Infinity,
    refetchInterval: 60 * 1000,
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 60 * 1000);

    return () => clearInterval(intervalId);
  }, [refetch]);



  if (isPending) return <CenterLoader />

  if (isError) return (
    <Flex direction="column" justify="center" h="100%">
      <Text align="center">Error loading!</Text>
    </Flex>
  )

  if (!imageBlob || !(imageBlob instanceof Blob)) console.error('imageBlob not Blob object:', imageBlob)

  const image = URL.createObjectURL(imageBlob!)

  return (
    <>
      {enabled ? <img src={image} alt="Dynamic Content" {...rest}/>
        :
        <Flex direction="column" justify="center" h="100%">
          <Text align="center">Camera is disabled in config, no stream or snapshot available!</Text>
        </Flex>
      }
    </>)
};

export default AutoUpdatedImage
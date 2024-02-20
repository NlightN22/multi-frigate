import { useEffect, useRef } from "react";
import { CameraConfig } from "../../../types/frigateConfig";
import { AspectRatio, Flex, createStyles, Text } from "@mantine/core";

interface CameraImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
  cameraConfig: CameraConfig;
  onload?: () => void;
  searchParams?: {};
  url: string
};

const useStyles = createStyles((theme) => ({
  
 }))


export default function CameraImage({
  className,
  cameraConfig,
  onload,
  searchParams = "",
  url, ...rest }: CameraImageProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const { classes } = useStyles();

  const name = cameraConfig.name
  const enabled = cameraConfig.enabled

  useEffect(() => {
    if (!cameraConfig || !imgRef.current) {
      return;
    }
    imgRef.current.src = url
  }, [name, imgRef, searchParams]);

  return (
    <Flex direction='column' justify='center' h='100%'>
      {enabled ? (
        <AspectRatio ratio={1.5}>
          <img
            ref={imgRef}
            {...rest}
          />
        </AspectRatio>
      ) : (
        <Text align='center'>
          Camera is disabled in config, no stream or snapshot available!
        </Text>
      )}
    </Flex>
  );
}

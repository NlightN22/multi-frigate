// import { useCallback, useEffect, useMemo, useState } from "react";
// import CameraImage from "./CameraImage";
// import { CameraConfig } from "../../../types/frigateConfig";
// import { useDocumentVisibility } from "@mantine/hooks";
// import { AspectRatio, Flex } from "@mantine/core";

export {}

// interface AutoUpdatingCameraImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
//   cameraConfig?: CameraConfig
//   searchParams?: {};
//   showFps?: boolean;
//   className?: string;
//   url: string
// };

// // TODO Delete
// export default function AutoUpdatingCameraImage({
//   cameraConfig,
//   searchParams = "",
//   showFps = true,
//   className,
//   url,
//   ...rest
// }: AutoUpdatingCameraImageProps) {
//   const [key, setKey] = useState(Date.now());
//   const [fps, setFps] = useState<string>("0");
//   const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();

//   const windowVisible = useDocumentVisibility()


//   const reloadInterval = useMemo(() => {
//     if (windowVisible === "hidden") {
//       return -1; // no reason to update the image when the window is not visible
//     }

//     // if (liveReady) {
//     //   return 60000;
//     // }

//     // if (cameraActive) {
//     //   return 200;
//     // }

//     return 30000;
//   }, [windowVisible]);

//   useEffect(() => {
//     if (reloadInterval == -1) {
//       return;
//     }

//     setKey(Date.now());

//     return () => {
//       if (timeoutId) {
//         clearTimeout(timeoutId);
//         setTimeoutId(undefined);
//       }
//     };
//   }, [reloadInterval]);

//   const handleLoad = useCallback(() => {
//     if (reloadInterval == -1) {
//       return;
//     }

//     const loadTime = Date.now() - key;

//     if (showFps) {
//       setFps((1000 / Math.max(loadTime, reloadInterval)).toFixed(1));
//     }

//     setTimeoutId(
//       setTimeout(
//         () => {
//           setKey(Date.now());
//         },
//         loadTime > reloadInterval ? 1 : reloadInterval
//       )
//     );
//   }, [key, setFps]);

//   return (
//     // <AspectRatio ratio={1}>
//     <Flex direction='column' h='100%'>
//       {/* <CameraImage
//         cameraConfig={cameraConfig}
//         onload={handleLoad}
//         enabled={cameraConfig?.enabled}
//         url={url}
//         {...rest}
//       /> */}
//       {showFps ? <span className="text-xs">Displaying at {fps}fps</span> : null}
//     </Flex>
//     // </AspectRatio >
//   );
// }

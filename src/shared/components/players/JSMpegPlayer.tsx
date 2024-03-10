// @ts-ignore we know this doesn't have types
import JSMpeg from "@cycjimmy/jsmpeg-player";
import { useViewportSize } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type JSMpegPlayerProps = {
  wsUrl: string;
  cameraHeight?: number,
  cameraWidth?: number,
};

const JSMpegPlayer = (
  {
    wsUrl,
    cameraWidth = 1200,
    cameraHeight = 800,
  }: JSMpegPlayerProps
) => {
  const { t } = useTranslation()
  const playerRef = useRef<HTMLDivElement>(null);
  const [playerInitialized, setPlayerInitialized] = useState(false)

  const { height: maxHeight, width: maxWidth } = useViewportSize()

  useEffect(() => {
    const video = new JSMpeg.VideoElement(
      playerRef.current,
      wsUrl,
      {},
      { protocols: [], audio: false, videoBufferSize: 1024 * 1024 * 4 }
    );

    const toggleFullscreen = () => {
      const canvas = video.els.canvas;
      if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) { // Use bracket notation for webkit
        // Enter fullscreen
        if (canvas.requestFullscreen) {
          canvas.requestFullscreen();
        } else if ((canvas as any).webkitRequestFullScreen) { // Use bracket notation for webkit
          (canvas as any).webkitRequestFullScreen();
        } else if (canvas.mozRequestFullScreen) {
          canvas.mozRequestFullScreen();
        }
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) { // Use bracket notation for webkit
          (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          (document as any).mozCancelFullScreen();
        }
      }
    };

    video.els.canvas.addEventListener('dblclick', toggleFullscreen);

    return () => {
      video.destroy();
      video.els.canvas.removeEventListener('dblclick', toggleFullscreen);
    };
  }, [wsUrl]);

  return (
    <div
      ref={playerRef}
      key={wsUrl}
      title={t('player.doubleClickToFullHint')}
      style={{ width: cameraWidth, height: cameraHeight, maxWidth: maxWidth, maxHeight: maxHeight - 100, }} />
  )
};

export default JSMpegPlayer
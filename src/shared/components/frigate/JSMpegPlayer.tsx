// @ts-ignore we know this doesn't have types
import JSMpeg from "@cycjimmy/jsmpeg-player";
import { useEffect, useMemo, useRef } from "react";
import { useResizeObserver } from "../../utils/resize-observer";

type JSMpegPlayerProps = {
  className?: string;
  wsUrl: string;
  camera: string;
  width: number;
  height: number;
};

export default function JSMpegPlayer({
  camera,
  wsUrl,
  width,
  height,
  className,
}: JSMpegPlayerProps) {
  const playerRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [{ width: containerWidth, height: containerHeight }] =
    useResizeObserver(containerRef);

  // Add scrollbar width (when visible) to the available observer width to eliminate screen juddering.
  // https://github.com/blakeblackshear/frigate/issues/1657
  let scrollBarWidth = 0;
  if (window.innerWidth && document.body.offsetWidth) {
    scrollBarWidth = window.innerWidth - document.body.offsetWidth;
  }
  const availableWidth = scrollBarWidth
    ? containerWidth + scrollBarWidth
    : containerWidth;
  const aspectRatio = width / height;

  const scaledHeight = useMemo(() => {
    const scaledHeight = Math.floor(availableWidth / aspectRatio);
    const finalHeight = Math.min(scaledHeight, height);

    if (containerHeight < finalHeight) {
      return containerHeight;
    }

    if (finalHeight > 0) {
      return finalHeight;
    }

    return 100;
  }, [availableWidth, aspectRatio, height]);
  const scaledWidth = useMemo(
    () => Math.ceil(scaledHeight * aspectRatio - scrollBarWidth),
    [scaledHeight, aspectRatio, scrollBarWidth]
  );

  useEffect(() => {
    if (!playerRef.current) {
      return;
    }

    const video = new JSMpeg.VideoElement(
      playerRef.current,
      wsUrl,
      {},
      { protocols: [], audio: false, videoBufferSize: 1024 * 1024 * 4 }
    );

    const fullscreen = () => {
      if (video.els.canvas.webkitRequestFullScreen) {
        video.els.canvas.webkitRequestFullScreen();
      } else {
        video.els.canvas.mozRequestFullScreen();
      }
    };

    video.els.canvas.addEventListener("click", fullscreen);

    return () => {
      if (playerRef.current) {
        try {
          video.destroy();
        } catch (e) {}
        playerRef.current = null;
      }
    };
  }, [wsUrl]);

  return (
    <div className={className} ref={containerRef}>
      <div
        ref={playerRef}
        className={`jsmpeg`}
        style={{
          height: `${600}px`,
          width: `${800}px`,
        }}
      />
    </div>
  );
}
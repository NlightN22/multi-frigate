// @ts-ignore we know this doesn't have types
import JSMpeg from "@cycjimmy/jsmpeg-player";
import { useEffect, useMemo, useRef, useState } from "react";

type JSMpegPlayerProps = {
  wsUrl: string;
};


const JSMpegPlayer = (
  {
    wsUrl,

  }: JSMpegPlayerProps
) => {
  const videoRef = useRef<HTMLCanvasElement>(null);
  const [playerInitialized, setPlayerInitialized] = useState(false)

  useEffect(() => {
    let player: any;

    if (player && playerInitialized) {
      player.destroy()
      console.log('JSMpegPlayer destroyed player')
    }
    if (!playerInitialized && videoRef.current) {
      console.log('JSMpegPlayer creating player')
      player = new JSMpeg.Player(
        wsUrl,
        { canvas: videoRef.current },
        {},
        { protocols: [], audio: false }
      );
      setPlayerInitialized(true);
    }

    return () => {
      try {
        console.log('JSMpegPlayer destroying player')
        player.destroy()
        console.log('JSMpegPlayer destroyed player')
        setPlayerInitialized(false)
      } catch (error) {
        setPlayerInitialized(true)
        console.error('JSMpegPlayer Error on unmount:', error);
      }
    };
  }, [wsUrl]);

  return <canvas key={wsUrl} ref={videoRef}></canvas>;
};

export default JSMpegPlayer
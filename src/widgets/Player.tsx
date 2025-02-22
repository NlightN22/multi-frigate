import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useCameraActivity from '../hooks/use-camera-activity';
import useCameraLiveMode from '../hooks/use-camera-live-mode';
import { proxyApi } from '../services/frigate.proxy/frigate.api';
import { GetCameraWHostWConfig } from '../services/frigate.proxy/frigate.schema';
import JSMpegPlayer from '../shared/components/players/JSMpegPlayer';
import MSEPlayer from '../shared/components/players/MsePlayer';
import WebRtcPlayer from '../shared/components/players/WebRTCPlayer';
import { LivePlayerMode, PlayerStatsType } from '../types/live';
import { isProduction } from '../shared/env.const';

type LivePlayerProps = {
  camera: GetCameraWHostWConfig;
  cameraRef?: (ref: HTMLDivElement | null) => void;
  useWebGL: boolean;
  containerRef?: React.MutableRefObject<HTMLDivElement | null>;
  preferredLiveMode?: LivePlayerMode;
  showStillWithoutActivity?: boolean;
  windowVisible?: boolean;
};

const Player = ({
  camera,
  cameraRef = undefined,
  useWebGL = false,
  showStillWithoutActivity = true,
  containerRef,
  preferredLiveMode,
  windowVisible = true,
}: LivePlayerProps) => {
  const internalContainerRef = useRef<HTMLDivElement | null>(null);

  // stats

  const [stats, setStats] = useState<PlayerStatsType>({
    streamType: "-",
    bandwidth: 0, // in kbps
    latency: undefined, // in seconds
    totalFrames: 0,
    droppedFrames: undefined,
    decodedFrames: 0,
    droppedFrameRate: 0, // percentage
  });

  const hostNameWPort = camera.frigateHost ? new URL(camera.frigateHost.host).host : ''
  const wsUrl = proxyApi.cameraWsURL(hostNameWPort, camera.name)
  const cameraConfig = camera.config!

  const [key, setKey] = useState(0);


  const { activeMotion, activeTracking } =
    useCameraActivity(cameraConfig);

  const cameraActive = useMemo(
    () =>
      !showStillWithoutActivity ||
      (windowVisible && (activeMotion || activeTracking)),
    [activeMotion, activeTracking, showStillWithoutActivity, windowVisible],
  );

  // camera live state
  const liveMode = useCameraLiveMode(cameraConfig, preferredLiveMode);

  const [liveReady, setLiveReady] = useState(false);
  useEffect(() => {
    if (!liveReady) {
      if (cameraActive && liveMode === "jsmpeg") {
        setLiveReady(true);
      }

      return;
    }

    if (!cameraActive) {
      setLiveReady(false);
    }
  }, [cameraActive, liveReady, liveMode]);


  const playerIsPlaying = useCallback(() => {
    setLiveReady(true);
  }, []);


  let player;
  if (liveMode === "webrtc") {
    player = (
      <WebRtcPlayer
        className={`rounded-2xl h-full ${liveReady ? "" : "hidden"}`}
        camera={cameraConfig.live.stream_name}
        playbackEnabled={cameraActive}
        onPlaying={() => setLiveReady(true)}
        wsURI={wsUrl}
      />
    );
  } else if (liveMode === "mse") {
    if ("MediaSource" in window || "ManagedMediaSource" in window) {
      player = (
        <MSEPlayer
          className={`rounded-2xl h-full ${liveReady ? "" : "hidden"}`}
          camera='Not yet implemented' // TODO implement MSE player with audio
          playbackEnabled={cameraActive}
          onPlaying={() => setLiveReady(true)}
          wsUrl={wsUrl}
        />
      );
    } else {
      player = (
        <div className="w-5xl text-center text-sm">
          MSE is only supported on iOS 17.1+. You'll need to update if available
          or use jsmpeg / webRTC streams. See the docs for more info.
        </div>
      );
    }
  } else if (liveMode === "jsmpeg") {
    player = (
      <JSMpegPlayer
        key={"jsmpeg_" + key}
        url={wsUrl}
        camera={camera.config.name}
        className="flex justify-center overflow-hidden rounded-lg md:rounded-2xl"
        width={camera.config.detect.width}
        height={camera.config.detect.height}
        playbackEnabled={
          showStillWithoutActivity
        }
        containerRef={containerRef ?? internalContainerRef}
        useWebGL={useWebGL}
        setStats={setStats}
        onPlaying={playerIsPlaying}
      />
    );
  }

  return player ? player : null
}

export default Player;
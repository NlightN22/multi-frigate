import React, { useEffect, useMemo, useState } from 'react';
import JSMpegPlayer from './JSMpegPlayer';
import MSEPlayer from './MsePlayer';
import { CameraConfig } from '../../../types/frigateConfig';
import { LivePlayerMode } from '../../../types/live';
import useCameraActivity from '../../../hooks/use-camera-activity';
import useCameraLiveMode from '../../../hooks/use-camera-live-mode';
import WebRtcPlayer from './WebRTCPlayer';

type LivePlayerProps = {
  className?: string;
  cameraConfig: CameraConfig;
  preferredLiveMode?: LivePlayerMode;
  showStillWithoutActivity?: boolean;
  windowVisible?: boolean;
  host: string
};

const Player = ({
  className,
  cameraConfig,
  preferredLiveMode,
  showStillWithoutActivity = true,
  windowVisible = true,
  host
}: LivePlayerProps) => {

  const wsUrl = 'ws://localhost:4000/proxy-ws/ws?hostName=localhost:5000'

  const { activeMotion, activeAudio, activeTracking } =
    useCameraActivity(cameraConfig);

  const cameraActive = useMemo(
    () => windowVisible && (activeMotion || activeTracking),
    [activeMotion, activeTracking, windowVisible]
  );

  // camera live state
  const liveMode = useCameraLiveMode(cameraConfig, preferredLiveMode);

  const [liveReady, setLiveReady] = useState(false);
  useEffect(() => {
    if (!liveReady) {
      if (cameraActive && liveMode == "jsmpeg") {
        setLiveReady(true);
      }

      return;
    }

    if (!cameraActive) {
      setLiveReady(false);
    }
  }, [cameraActive, liveReady]);

  let player;
  if (liveMode == "webrtc") {
    player = (
      <WebRtcPlayer
        className={`rounded-2xl h-full ${liveReady ? "" : "hidden"}`}
        camera={cameraConfig.live.stream_name}
        playbackEnabled={cameraActive}
        onPlaying={() => setLiveReady(true)}
        wsUrl={wsUrl}
      />
    );
  } else if (liveMode == "mse") {
    if ("MediaSource" in window || "ManagedMediaSource" in window) {
      player = (
        <MSEPlayer
          className={`rounded-2xl h-full ${liveReady ? "" : "hidden"}`}
          camera='Not yet implemented'
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
  } else if (liveMode == "jsmpeg") {
    player = (
      <JSMpegPlayer
        className="w-full flex justify-center rounded-2xl overflow-hidden"
        camera='Not yet implemented'
        width={600}
        height={800}
        wsUrl='Not yet implemented'
      />
    );

    return (
      <div>

      </div>
    );
  }
}

export default Player;
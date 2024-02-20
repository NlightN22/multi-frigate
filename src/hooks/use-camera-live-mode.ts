import { useMemo } from "react";
import { usePersistence } from "./use-persistence";
import { CameraConfig, FrigateConfig } from "../types/frigateConfig";
import { LivePlayerMode } from "../types/live";

export default function useCameraLiveMode(
  cameraConfig: CameraConfig,
  preferredMode?: string
): LivePlayerMode {
  // const { data: config } = useSWR<FrigateConfig>("config");
  const { data: config } = {
    data: { 
      go2rtc: { streams: 'test' },
      ui: {live_mode: ''}
    },

  }

  const restreamEnabled = useMemo(() => {
    if (!config) {
      return false;
    }

    return (
      cameraConfig &&
      Object.keys(config.go2rtc.streams || {}).includes(
        cameraConfig.live.stream_name
      )
    );
  }, [config, cameraConfig]);
  const defaultLiveMode = useMemo(() => {
    if (config && cameraConfig) {
      if (restreamEnabled) {
        return cameraConfig.ui.live_mode || config?.ui.live_mode;
      }

      return "jsmpeg";
    }

    return undefined;
  }, [cameraConfig, restreamEnabled]);
  const [viewSource] = usePersistence(
    `${cameraConfig.name}-source`,
    defaultLiveMode
  );

  if (
    restreamEnabled &&
    (preferredMode == "mse" || preferredMode == "webrtc")
  ) {
    return preferredMode;
  } else {
    return viewSource;
  }
}

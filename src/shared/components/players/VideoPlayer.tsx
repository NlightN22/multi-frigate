import React, { useRef, useEffect } from 'react';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css'
import { isProduction } from '../../env.const';
import { useKeycloak } from '@react-keycloak/web';

interface VideoPlayerProps {
  videoUrl: string
}

const VideoPlayer = ({ videoUrl }: VideoPlayerProps) => {
  const { keycloak } = useKeycloak()
  const executed = useRef(false)
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    if (!executed.current) {
      //@ts-ignore
      videojs.Vhs.xhr.beforeRequest = function (options: any) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${keycloak.token}`,
        };
        return options;
      };

      const defaultOptions = {
        preload: 'auto',
        autoplay: true,
        sources: [
          {
            src: videoUrl,
            type: 'application/vnd.apple.mpegurl',
            withCredentials: true,
          },
        ],
        controls: true,
        controlBar: {
          skipButtons: { forward: 10, backward: 5 },
        },
        playbackRates: [0.5, 1, 2, 4, 8],
        fluid: true,
      };

      if (!videojs.browser.IS_FIREFOX) {
        defaultOptions.playbackRates.push(16);
      }

      //TODO add rotations on IOS and android devices

      if (!isProduction) console.log('playerRef.current', playerRef.current)

      if (videoRef.current) {
        if (!isProduction) console.log('mount new player')
        playerRef.current = videojs(videoRef.current, { ...defaultOptions }, () => {
          if (!isProduction) console.log('player is ready')
        });
      }
      if (!isProduction) console.log('VideoPlayer rendered')
      return () => {
        if (playerRef.current !== null) {
          playerRef.current.dispose();
          playerRef.current = null;
          if (!isProduction) console.log('unmount player')
        }
      };
    }
    executed.current = true
  }, []);


  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.src(videoUrl);
      if (!isProduction) console.log('player change src')
    }
  }, [videoUrl]);

  return (
    <div data-vjs-player>
      {/* Setting an empty data-setup is required to override the default values and allow video to be fit the size of its parent */}
      <video ref={videoRef} className="small-player video-js vjs-default-skin" data-setup="{}" controls playsInline />
    </div>
  );
};

export default VideoPlayer;


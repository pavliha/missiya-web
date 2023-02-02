import { type FC, useState } from 'react';
import useScript from 'react-script-hook';
import { loadJanus } from 'src/utils/janus';
import * as process from 'process';

const serverUrl = (): string => {
  const url = process.env.JANUS_URL;
  if (!url) throw new Error('No JANUS_URL');
  return url;
};

export const VideoScript: FC = () => {
  const [, setLoadedVideo] = useState<boolean>(false); // TODO: add logic for isLoadedVideo variable (??? if needed ???)
  const [videoError, setVideoError] = useState<Error | null>(null);

  const [loading, scriptError] = useScript({
    src: '/libs/janus.js',
    onload: () => {
      loadJanus({
        server: serverUrl(),
        callback: () => setLoadedVideo(true),
        errorCallback: (error) => setVideoError(error),
      });
    },
  });

  const error = scriptError || videoError;
  if (loading) return <p className="text-white">Loading video stream...</p>;
  if (error) return <h3 className="text-white">Failed to load video: {error.message}</h3>;

  return <video className="aspect-video w-full" id="webrtc-output" autoPlay playsInline poster="/logo.svg" />;
};

import { type FC, useState } from 'react';
import useScript from 'react-script-hook';
import { loadJanus } from 'src/utils/janus';

export const VideoScript: FC = () => {
  const [, setLoadedVideo] = useState<boolean>(false); // TODO: add logic for isLoadedVideo variable (??? if needed ???)
  const [videoError, setVideoError] = useState<Error | null>(null);

  const [loading, scriptError] = useScript({
    src: '/libs/janus.js',
    onload: () => {
      loadJanus({
        server: 'http://165.232.66.224:8088/janus',
        callback: () => setLoadedVideo(true),
        errorCallback: (error) => setVideoError(error),
      });
    },
  });

  const error = scriptError || videoError;
  if (loading) return <p className="text-white">Loading Stripe API...</p>;
  if (error) return <h3 className="text-white">Failed to load Stripe API: {error.message}</h3>;

  return <video className="aspect-video w-full" id="webrtc-output" autoPlay playsInline poster="/logo.svg" />;
};

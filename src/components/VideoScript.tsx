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
        server: String(process.env.NEXT_PUBLIC_JANUS_URL),
        callback: () => setLoadedVideo(true),
        errorCallback: (error) => setVideoError(error),
      });
    },
  });

  const error = scriptError || videoError;
  if (loading) return <p className="text-white">Loading video stream...</p>;
  if (error) return <h3 className="text-white">Failed to load video: {error.message}</h3>;

  return (
    <video
      autoPlay
      controls
      playsInline
      id="webrtc-output"
      poster="/logo.svg"
      className="aspect-video w-8/12 rounded-lg border-0"
    />
  );
};

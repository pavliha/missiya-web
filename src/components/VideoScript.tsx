import { type FC, useState, useEffect } from 'react';
import useScript from 'react-script-hook';
import { loadJanus } from 'src/utils/janus';

interface Props {
  serialNumber: string;
}
export const VideoScript: FC<Props> = ({ serialNumber }) => {
  const [, setLoadedVideo] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<Error | null>(null);
  const [isLoaded, setLoaded] = useState(false);

  const [loading, scriptError] = useScript({
    src: '/libs/janus.js',
    onload: () => setLoaded(true),
  });

  useEffect(() => {
    if (isLoaded) {
      loadJanus({
        server: `https://${serialNumber}.${String(process.env.NEXT_PUBLIC_API_HOST)}/janus`,
        callback: () => setLoadedVideo(true),
        errorCallback: (error) => setVideoError(error),
      });
    }
  }, [isLoaded, serialNumber]);

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

import { type NextPage } from 'next';
import { useRouter } from 'next/router';
import { Layout } from 'src/components';
import { JanusStatus, useJanus } from 'src/hooks/useJanus';
import { useState } from 'react';
import { PlayButton } from '../../../components/PlayButton';

const messages: Record<JanusStatus, (serialNumber: string) => string> = {
  [JanusStatus.IDLE]: () => 'Idle',
  [JanusStatus.LOADING_SCRIPT]: () => 'Initialing...',
  [JanusStatus.LOADING_SCRIPT_ERROR]: () => 'Failed to initialize',
  [JanusStatus.LOADED_SCRIPT]: (serialNumber: string) => `Waiting for ${serialNumber} to be online...`,
  [JanusStatus.REMOTE_TRACK_ARRIVED]: () => `Remote track arrived...`,
  [JanusStatus.INIT_STREAMING]: () => `Starting stream...`,
  [JanusStatus.ERROR]: () => `Error streaming`,
  [JanusStatus.MESSAGE_RECEIVED]: () => `Message received`,
};

const VideoPage: NextPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  const router = useRouter();
  const { serialNumber } = router.query;
  const { status } = useJanus(String(serialNumber));

  console.log(status);

  return (
    <Layout className="bg-[#212121]">
      <div className="flex flex-col justify-center flex-1" onClick={handlePlayPause}>
        {!isPlaying && <PlayButton />}
        <video autoPlay id="webrtc-output" className="w-full aspect-video border-0 bg-[#212121]" />
      </div>
      <div className="absolute left-4 bottom-4 text-lg text-white flex items-center">
        <div className="rounded-full w-4 h-4 bg-red-600 mr-2" />
        {messages[status](String(serialNumber))}
      </div>
    </Layout>
  );
};

export default VideoPage;

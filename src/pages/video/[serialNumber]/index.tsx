import { useState } from 'react';
import { type NextPage } from 'next';
import { useRouter } from 'next/router';
import { Layout } from 'src/components';
import { JanusStatus, useJanus } from 'src/hooks/useJanus';

const messages: Record<JanusStatus, (serialNumber: string) => string> = {
  [JanusStatus.IDLE]: () => 'Waiting for drone to be online...',
  [JanusStatus.LOADING_SCRIPT]: () => 'Initialing...',
  [JanusStatus.LOADING_SCRIPT_ERROR]: () => 'Failed to initialize',
  [JanusStatus.LOADED_SCRIPT]: (serialNumber: string) => `Waiting for ${serialNumber} to be online...`,
  [JanusStatus.REMOTE_TRACK_ARRIVED]: () => `Streaming...`,
  [JanusStatus.INIT_STREAMING]: () => `Starting stream...`,
  [JanusStatus.ERROR]: () => `Error streaming`,
  [JanusStatus.MESSAGE_RECEIVED]: () => `Streaming...`,
  [JanusStatus.DETACHED]: () => `Closed connection`,
  [JanusStatus.MUTE]: () => `Removing remote track`,
  [JanusStatus.UNMUTE]: () => `Recovered remote track`,
};

const VideoPage: NextPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  const router = useRouter();
  const { serialNumber } = router.query;
  const { status } = useJanus(String(serialNumber));

  return (
    <Layout className="bg-[#212121]">
      <div className="flex flex-col justify-center flex-1" onClick={handlePlayPause}>
        <video controls autoPlay id="webrtc-output" className="w-full aspect-video border-0 bg-[#212121]" />
      </div>
      <div className="absolute left-6 top-6 text-lg text-white flex items-center">
        <div className="rounded-full w-4 h-4 bg-red-600 mx-2" />
        {messages[status](String(serialNumber))}
      </div>
    </Layout>
  );
};

export default VideoPage;

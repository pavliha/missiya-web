import { useState } from 'react';
import { type NextPage } from 'next';
import { useRouter } from 'next/router';
import { Layout } from 'src/components';
import { JanusStatus, JanusUnion, useJanusStatus } from 'src/hooks/useJanusStatus';

const messages: Record<JanusStatus, (status: JanusUnion, serialNumber: string) => string> = {
  IDLE: () => 'Waiting for drone to be online...',
  LOADING_SCRIPT: () => 'Initialing...',
  LOADING_SCRIPT_ERROR: (status) => (status as { error: Error }).error.message,
  LOADED_SCRIPT: (_, serialNumber) => `Waiting for ${serialNumber} to be online...`,
  REMOTE_TRACK_ARRIVED: () => `Streaming...`,
  INIT_STREAMING: () => `Starting stream...`,
  ERROR: () => `Not connected! Stopped streaming...`,
  MESSAGE_RECEIVED: () => `Streaming...`,
  DETACHED: () => `Closed connection`,
  MUTE: () => `Removing remote track`,
  UNMUTE: () => `Recovered remote track`,
};

const VideoPage: NextPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const router = useRouter();
  const serialNumber = String(router.query.serialNumber);
  const status = useJanusStatus(serialNumber);
  const createMessage = messages[status.kind];

  const handlePlayPause = () => setIsPlaying(!isPlaying);

  return (
    <Layout className="bg-[#212121]">
      <div className="flex flex-col justify-center flex-1" onClick={handlePlayPause}>
        <video controls autoPlay id="webrtc-output" className="w-full aspect-video border-0 bg-[#212121]" />
      </div>
      <div className="absolute left-6 top-6 text-lg text-white flex items-center">
        <div className="rounded-full w-4 h-4 bg-red-600 mx-2" />
        {createMessage(status, serialNumber)}
      </div>
    </Layout>
  );
};

export default VideoPage;

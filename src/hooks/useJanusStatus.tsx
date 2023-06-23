import { useEffect, useState } from 'react';
import { loadJanus } from '../utils/janus';
import { ScriptStatus, useJanusScriptStatus } from './useJanusScriptStatus';

export type JanusStatus =
  | 'IDLE'
  | 'LOADING_SCRIPT'
  | 'LOADING_SCRIPT_ERROR'
  | 'LOADED_SCRIPT'
  | 'INIT_STREAMING'
  | 'REMOTE_TRACK_ARRIVED'
  | 'MESSAGE_RECEIVED'
  | 'ERROR'
  | 'DETACHED'
  | 'MUTE'
  | 'UNMUTE';

export type JanusUnion = DiscriminatedUnion<
  'kind',
  {
    IDLE: {};
    LOADING_SCRIPT: {};
    LOADING_SCRIPT_ERROR: { error: Error };
    LOADED_SCRIPT: {};
    INIT_STREAMING: {};
    REMOTE_TRACK_ARRIVED: {};
    MESSAGE_RECEIVED: { message: JanusJS.Message };
    ERROR: { error: Error };
    DETACHED: {};
    MUTE: {};
    UNMUTE: {};
  }
>;

const handleJanusStatus = (serialNumber: string, setStatus: (status: JanusUnion) => void) => {
  setStatus({ kind: 'LOADED_SCRIPT' });
  loadJanus({
    server: `https://${serialNumber}.${String(process.env.NEXT_PUBLIC_API_HOST)}/janus`,
    onMessage: (message) => setStatus({ kind: 'MESSAGE_RECEIVED', message }),
    onInitStreaming: () => setStatus({ kind: 'INIT_STREAMING' }),
    onDetached: () => setStatus({ kind: 'DETACHED' }),
    onMute: () => setStatus({ kind: 'MUTE' }),
    onError: (error) => setStatus({ kind: 'ERROR', error }),
    onUnmute: () => setStatus({ kind: 'UNMUTE' }),
    onRemoteTrack: () => setStatus({ kind: 'REMOTE_TRACK_ARRIVED' }),
  });
};

const makeStatusMap = (
  setStatus: (status: JanusUnion) => void,
  onLoad: () => void,
): Record<ScriptStatus, () => void> => ({
  [ScriptStatus.IDLE]: () => setStatus({ kind: 'IDLE' }),
  [ScriptStatus.LOADING]: () => setStatus({ kind: 'LOADING_SCRIPT' }),
  [ScriptStatus.ERROR]: () =>
    setStatus({ kind: 'LOADING_SCRIPT_ERROR', error: new Error('Failed to initialize script') }),
  [ScriptStatus.LOADED]: onLoad,
});

export const useJanusStatus = (serialNumber: string): JanusUnion => {
  const scriptStatus = useJanusScriptStatus();
  const [status, setStatus] = useState<JanusUnion>({ kind: 'IDLE' });

  useEffect(() => {
    const handleLoaded = () => handleJanusStatus(serialNumber, setStatus);
    const statusMap = makeStatusMap(setStatus, handleLoaded);
    statusMap[scriptStatus]();
  }, [scriptStatus, serialNumber]);

  return status;
};

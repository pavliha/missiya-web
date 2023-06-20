import { useEffect, useState } from 'react';
import { loadJanus } from '../utils/janus';
import { ScriptStatus, useJanusScript } from './useJanusScript';

export enum JanusStatus {
  IDLE = 'IDLE',
  LOADING_SCRIPT = 'LOADING_SCRIPT',
  LOADING_SCRIPT_ERROR = 'LOADING_SCRIPT_ERROR',
  LOADED_SCRIPT = 'LOADED_SCRIPT',
  INIT_STREAMING = 'INIT_STREAMING',
  REMOTE_TRACK_ARRIVED = 'REMOTE_TRACK_ARRIVED',
  MESSAGE_RECEIVED = 'MESSAGE_RECEIVED',
  ERROR = 'ERROR',
}

export const useJanus = (serialNumber: string) => {
  const { status: scriptStatus } = useJanusScript();
  const [status, setStatus] = useState<JanusStatus>(JanusStatus.IDLE);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const statusMap: Record<ScriptStatus, () => void> = {
      [ScriptStatus.IDLE]: () => setStatus(JanusStatus.IDLE),
      [ScriptStatus.LOADING]: () => setStatus(JanusStatus.LOADING_SCRIPT),
      [ScriptStatus.ERROR]: () => setStatus(JanusStatus.LOADING_SCRIPT_ERROR),
      [ScriptStatus.LOADED]: () => {
        setStatus(JanusStatus.LOADED_SCRIPT);
        loadJanus({
          server: `https://${serialNumber}.${String(process.env.NEXT_PUBLIC_API_HOST)}/janus`,
          onMessage: () => setStatus(JanusStatus.MESSAGE_RECEIVED),
          onInitStreaming: () => setStatus(JanusStatus.INIT_STREAMING),
          onError: (error) => {
            setStatus(JanusStatus.ERROR);
            setError(error);
          },
          onRemoteTrackArrived: () => setStatus(JanusStatus.REMOTE_TRACK_ARRIVED),
        });
      },
    };

    statusMap[scriptStatus]();
  }, [scriptStatus, serialNumber]);

  return { status, error };
};

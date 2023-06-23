import { useEffect, useState } from 'react';
import useScript from 'react-script-hook';

export enum ScriptStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
  ERROR = 'ERROR',
}

export const useJanusScriptStatus = () => {
  const [status, setStatus] = useState<ScriptStatus>(ScriptStatus.IDLE);

  const [loading, error] = useScript({
    src: '/libs/janus.js',
    onload: () => setStatus(ScriptStatus.LOADED),
  });

  useEffect(() => {
    if (error) setStatus(ScriptStatus.ERROR);
    if (loading) setStatus(ScriptStatus.LOADING);
  }, [error, loading]);

  return status;
};

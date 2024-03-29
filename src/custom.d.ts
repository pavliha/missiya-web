/* eslint-disable @typescript-eslint/no-explicit-any */

declare type DiscriminatedUnion<K extends PropertyKey, T extends object> = {
  [P in keyof T]: { [Q in K]: P } & T[P] extends infer U ? { [Q in keyof U]: U[Q] } : never;
}[keyof T];

declare global {
  const Janus: string;
}

declare namespace JanusJS {
  interface Dependencies {
    adapter: any;
    jQuery: typeof jQuery;
    WebSocket: typeof WebSocket;
    newWebSocket: (server: string, protocol: string) => WebSocket;
    isArray: (array: any) => array is Array<any>;
    checkJanusExtension: () => boolean;
    httpAPICall: (url: string, options: any) => void;
  }

  enum DebugLevel {
    Trace = 'trace',
    Debug = 'debug',
    Log = 'log',
    Warning = 'warn',
    Error = 'error',
  }

  type JSEP = boolean;

  interface InitOptions {
    debug?: boolean | 'all' | DebugLevel[];
    callback?: () => void;
    dependencies?: Dependencies;
  }

  interface ConstructorOptions {
    server: string | string[];
    iceServers?: RTCIceServer[];
    ipv6?: boolean;
    withCredentials?: boolean;
    max_poll_events?: number;
    destroyOnUnload?: boolean;
    token?: string;
    apisecret?: string;
    success?: (opt?: any) => void;
    error?: (error: any) => void;
    destroyed?: () => void;
  }

  enum MessageType {
    Recording = 'recording',
    Starting = 'starting',
    Started = 'started',
    Stopped = 'stopped',
    SlowLink = 'slow_link',
    Preparing = 'preparing',
    Refreshing = 'refreshing',
  }

  interface Message {
    result?: {
      status: MessageType;
      id?: string;
      uplink?: number;
    };
    error?: Error;
  }

  interface PluginOptions {
    plugin: string;
    opaqueId?: string;
    success?: (handle: PluginHandle) => void;
    error?: (error: any) => void;
    consentDialog?: (on: boolean) => void;
    webrtcState?: (isConnected: boolean) => void;
    iceState?: (state: 'connected' | 'failed') => void;
    mediaState?: (state: { type: 'audio' | 'video'; on: boolean }) => void;
    slowLink?: (state: { uplink: boolean }) => void;
    onmessage?: (message: Message, jsep?: JSEP) => void;
    onlocalstream?: (stream: MediaStream) => void;
    onremotestream?: (stream: MediaStream) => void;
    ondataopen?: (label: string, protocol: string) => void;
    ondata?: (data: any, label: string) => void;
    oncleanup?: () => void;
    detached?: () => void;
  }

  interface OfferParams {
    media?: {
      audioSend?: boolean;
      audioRecv?: boolean;
      videoSend?: boolean;
      videoRecv?: boolean;
      audio?: boolean | { deviceId: string };
      video?:
        | boolean
        | { deviceId: string }
        | 'lowres'
        | 'lowres-16:9'
        | 'stdres'
        | 'stdres-16:9'
        | 'hires'
        | 'hires-16:9';
      data?: boolean;
      failIfNoAudio?: boolean;
      failIfNoVideo?: boolean;
      screenshareFrameRate?: number;
    };
    trickle?: boolean;
    stream?: MediaStream;
    success: () => void;
    error: (error: any) => void;
  }

  interface PluginMessage {
    message: {
      request: string;
      [otherProps: string]: any;
    };
    jsep?: JSEP;

    [otherProps: string]: any;
  }

  interface PluginHandle {
    getId(): string;

    getPlugin(): string;

    send(message: PluginMessage): void;

    createOffer(params: any): void;

    createAnswer(params: any): void;

    handleRemoteJsep(params: { jsep: JSEP }): void;

    dtmf(params: any): void;

    data(params: any): void;

    isVideoMuted(): boolean;

    muteVideo(): void;

    unmuteVideo(): void;

    getBitrate(): number;

    hangup(sendRequest?: boolean): void;

    detach(params: any): void;
  }

  interface UStreamerPluginHandle {
    send: (arg0: {
      message: { request: string; params: { audio: boolean } } | { request: string };
      jsep?: any;
    }) => void;
    createAnswer: (arg0: {
      jsep: any;
      // Prevent the client from sending audio and video, as this would
      // trigger a permission dialog in the browser.
      media: { audioSend: boolean; videoSend: boolean };
      success: (jsepAnswer: any) => void;
      error: { (...data: any[]): void; (message?: any, ...optionalParams: any[]): void };
    }) => void;
  }

  class Janus {
    useOldDependencies(deps: Partial<Dependencies>): Dependencies;

    init(options: InitOptions): void;

    isWebrtcSupported(): boolean;

    debug(...args: any[]): void;

    log(...args: any[]): void;

    warn(...args: any[]): void;

    error(...args: any[]): void;

    randomString(length: number): string;

    constructor(options: ConstructorOptions);

    getServer(): string;

    isConnected(): boolean;

    getSessionId(): string;

    attach(options: {
      onmessage: (msg: JanusJS.Message, jsepOffer: JanusJS.JSEP) => void;
      onmute: () => void;
      ondetached: () => void;
      plugin: string;
      success: (pluginHandle: JanusJS.UStreamerPluginHandle) => void;
      onremotetrack: (mediaStreamTrack: MediaStreamTrack, mediaId: number, isAdded: boolean) => void;
      onunmute: () => void;
      error: (error: Error) => void;
    }): void;

    useDefaultDependencies(deps?: Partial<Dependencies>): Dependencies;

    destroy(): void;
  }
}

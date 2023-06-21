/* eslint-disable */
import adapter from 'webrtc-adapter';

type Window = {
  Janus: JanusJS.Janus;
} & typeof globalThis;

interface LoadJanus {
  server: string;
  onInitStreaming: () => void;
  onError: (error: Error) => void;
  onMessage: (message: JanusJS.Message) => void;
  onRemoteTrack: () => void;
  onDetached: () => void;
  onMute: () => void;
  onUnmute: () => void;
}

export const loadJanus = ({
  server,
  onInitStreaming,
  onError,
  onMessage,
  onRemoteTrack,
  onDetached,
  onMute,
  onUnmute,
}: LoadJanus): void => {
  const Janus = (window as unknown as Window).Janus;

  const handleError = (error: Error) => {
    console.error(error.message);
    onError(error);
  };

  // Initialize Janus library.
  Janus.init({
    // Turn on debug logs in the browser console.
    debug: true,

    // Configure Janus to use standard browser APIs internally.
    dependencies: Janus.useDefaultDependencies({ adapter }),
  });

  // Establish a WebSockets connection to the server.
  // @ts-ignore
  const janus = new Janus({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    server, // : 'http://MQ23Z0000002.local:8088/janus',

    // Callback function if the client connects successfully.
    success: attachUStreamerPlugin,

    // Callback function if the client fails to connect.
    error: handleError,
  });

  let uStreamerPluginHandle: JanusJS.UStreamerPluginHandle | null = null;

  function attachUStreamerPlugin() {
    console.log('LOG');
    // Instruct the server to attach the µStreamer Janus plugin.
    janus.attach({
      // Qualifier of the plugin.
      plugin: 'janus.plugin.ustreamer',

      // Callback function, for when the server attached the plugin
      // successfully.
      success: function (pluginHandle: JanusJS.UStreamerPluginHandle) {
        uStreamerPluginHandle = pluginHandle;
        // Instruct the µStreamer Janus plugin to initiate streaming.
        uStreamerPluginHandle?.send({ message: { request: 'watch', params: { audio: true } } });

        onInitStreaming();
      },

      // Callback function if the server fails to attach the plugin.
      error: handleError,

      // Callback function for processing messages from the Janus server.
      onmessage: function (msg: JanusJS.Message, jsepOffer: JanusJS.JSEP) {
        onMessage(msg);
        // If there is a JSEP offer, respond to it. This starts the WebRTC
        // connection.
        if (!jsepOffer) return;
        uStreamerPluginHandle?.createAnswer({
          jsep: jsepOffer,
          // Prevent the client from sending audio and video, as this would
          // trigger a permission dialog in the browser.
          media: { audioSend: false, videoSend: false },
          success: function (jsepAnswer) {
            uStreamerPluginHandle?.send({
              message: { request: 'start' },
              jsep: jsepAnswer,
            });
          },
          error: handleError,
        });
      },

      onmute: onMute,

      ondetached: onDetached,

      onunmute: onUnmute,

      // Callback function, for when a media stream arrives.
      onremotetrack: function (mediaStreamTrack: MediaStreamTrack, mediaId: number, isAdded: boolean) {
        onRemoteTrack();
        if (isAdded) {
          // Attach the received media track to the video element. Cloning the
          // mediaStreamTrack creates a new object with a distinct, globally
          // unique stream identifier.
          const videoElement = document.getElementById('webrtc-output') as HTMLMediaElement;
          if (videoElement.srcObject === null) {
            videoElement.srcObject = new MediaStream();
          }
          (videoElement.srcObject as unknown as RTCPeerConnection).addTrack(mediaStreamTrack.clone());
        }
      },
    });
  }
};

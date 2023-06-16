/* eslint-disable */
import adapter from 'webrtc-adapter';

type Window = {
  Janus: JanusJS.Janus;
} & typeof globalThis;

interface LoadJanus {
  server: string;
  callback: () => void;
  errorCallback: (error: Error) => void;
}

export const loadJanus = ({ server, callback, errorCallback }: LoadJanus): void => {
  const Janus = (window as unknown as Window).Janus;

  const handleError = (error: Error) => {
    console.error(error.message);
    errorCallback(error);
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
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302',
        // url: 'turn:relay.metered.ca:80?transport=udp', // TODO: check. on type RTCIceServers need to use urls
        // urls: 'turn:relay.metered.ca:80?transport=udp',
        // credential: 'OiUGIaVmsnkDnEJH',
        // username: '290524eef1beb21ac07041f3',
      },
    ],
    server, // : 'http://165.232.66.224:8088/janus'

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

        callback();
      },

      // Callback function if the server fails to attach the plugin.
      error: handleError,

      // Callback function for processing messages from the Janus server.
      onmessage: function (msg: JanusJS.Message, jsepOffer: JanusJS.JSEP) {
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

      // Callback function, for when a media stream arrives.
      onremotetrack: function (mediaStreamTrack: MediaStreamTrack, mediaId: number, isAdded: boolean) {
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

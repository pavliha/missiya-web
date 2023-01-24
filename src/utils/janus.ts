/* eslint-disable */
import adapter from 'webrtc-adapter';

export const loadJanus = (server: string): void => {
  // @ts-ignore
  const Janus = window.Janus as unknown as JanusJS.Janus;

  // Initialize Janus library.
  // @ts-ignore
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
        url: 'stun:stun4.l.google.com:19302?transport=udp',
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
    error: console.error,
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
      },

      // Callback function if the server fails to attach the plugin.
      error: console.error,

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
          error: console.error,
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

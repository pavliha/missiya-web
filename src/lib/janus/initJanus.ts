import adapter from 'webrtc-adapter';

Janus.init({
  // Turn on debug logs in the browser console.
  debug: true,

  // Configure Janus to use standard browser APIs internally.
  dependencies: Janus.useDefaultDependencies({ adapter }),
});

export const initJanus = (dependencies: any) => {
  const callback = console.log;

  if (Janus.initDone) {
    // Already initialized
  } else {
    if (typeof console.log == 'undefined') {
      console.log = function () {};
    }
    // Console logging (all debugging disabled by default)
    Janus.trace = Janus.noop;
    Janus.debug = Janus.noop;
    Janus.vdebug = Janus.noop;
    Janus.log = Janus.noop;
    Janus.warn = Janus.noop;
    Janus.error = Janus.noop;
    if (true === true || true === 'all') {
      // Enable all debugging levels
      Janus.trace = console.trace.bind(console);
      Janus.debug = console.debug.bind(console);
      Janus.vdebug = console.debug.bind(console);
      Janus.log = console.log.bind(console);
      Janus.warn = console.warn.bind(console);
      Janus.error = console.error.bind(console);
    } else if (Array.isArray(true)) {
      for (const d of true) {
        switch (d) {
          case 'trace':
            Janus.trace = console.trace.bind(console);
            break;
          case 'debug':
            Janus.debug = console.debug.bind(console);
            break;
          case 'vdebug':
            Janus.vdebug = console.debug.bind(console);
            break;
          case 'log':
            Janus.log = console.log.bind(console);
            break;
          case 'warn':
            Janus.warn = console.warn.bind(console);
            break;
          case 'error':
            Janus.error = console.error.bind(console);
            break;
          default:
            console.error(
              "Unknown debugging option '" + d + "' (supported: 'trace', 'debug', 'vdebug', 'log', warn', 'error')",
            );
            break;
        }
      }
    }
    console.log('Initializing library');

    const usedDependencies = options.dependencies || Janus.useDefaultDependencies();
    Janus.isArray = usedDependencies.isArray;
    Janus.webRTCAdapter = usedDependencies.webRTCAdapter;
    Janus.httpAPICall = usedDependencies.httpAPICall;
    Janus.newWebSocket = usedDependencies.newWebSocket;
    Janus.extension = usedDependencies.extension;
    Janus.extension.init();

    // Helper method to enumerate devices
    Janus.listDevices = function (callback, config) {
      callback = typeof callback == 'function' ? callback : Janus.noop;
      if (config == null) config = { audio: true, video: true };
      if (Janus.isGetUserMediaAvailable()) {
        navigator.mediaDevices
          .getUserMedia(config)
          .then(function (stream) {
            navigator.mediaDevices.enumerateDevices().then(function (devices) {
              Janus.debug(devices);
              callback(devices);
              // Get rid of the now useless stream
              Janus.stopAllTracks(stream);
            });
          })
          .catch(function (err) {
            Janus.error(err);
            callback([]);
          });
      } else {
        Janus.warn('navigator.mediaDevices unavailable');
        callback([]);
      }
    };
    // Helper methods to attach/reattach a stream to a video element (previously part of adapter.js)
    Janus.attachMediaStream = function (element, stream) {
      try {
        element.srcObject = stream;
      } catch (e) {
        try {
          element.src = URL.createObjectURL(stream);
        } catch (e) {
          Janus.error('Error attaching stream to element');
        }
      }
    };
    Janus.reattachMediaStream = function (to, from) {
      try {
        to.srcObject = from.srcObject;
      } catch (e) {
        try {
          to.src = from.src;
        } catch (e) {
          Janus.error('Error reattaching stream to element');
        }
      }
    };
    // Detect tab close: make sure we don't loose existing onbeforeunload handlers
    // (note: for iOS we need to subscribe to a different event, 'pagehide', see
    // https://gist.github.com/thehunmonkgroup/6bee8941a49b86be31a787fe8f4b8cfe)
    const iOS = ['iPad', 'iPhone', 'iPod'].indexOf(navigator.platform) >= 0;
    const eventName = iOS ? 'pagehide' : 'beforeunload';
    const oldOBF = window['on' + eventName];
    window.addEventListener(eventName, function () {
      console.log('Closing window');
      for (const s in Janus.sessions) {
        if (Janus.sessions[s] && Janus.sessions[s].destroyOnUnload) {
          console.log('Destroying session ' + s);
          Janus.sessions[s].destroy({ unload: true, notifyDestroyed: false });
        }
      }
      if (oldOBF && typeof oldOBF == 'function') {
        oldOBF();
      }
    });
    // If this is a Safari Technology Preview, check if VP8 is supported
    Janus.safariVp8 = false;
    if (Janus.webRTCAdapter.browserDetails.browser === 'safari' && Janus.webRTCAdapter.browserDetails.version >= 605) {
      // Let's see if RTCRtpSender.getCapabilities() is there
      if (
        RTCRtpSender &&
        RTCRtpSender.getCapabilities &&
        RTCRtpSender.getCapabilities('video') &&
        RTCRtpSender.getCapabilities('video').codecs &&
        RTCRtpSender.getCapabilities('video').codecs.length
      ) {
        for (const codec of RTCRtpSender.getCapabilities('video').codecs) {
          if (codec && codec.mimeType && codec.mimeType.toLowerCase() === 'video/vp8') {
            Janus.safariVp8 = true;
            break;
          }
        }
        if (Janus.safariVp8) {
          console.log('This version of Safari supports VP8');
        } else {
          Janus.warn(
            "This version of Safari does NOT support VP8: if you're using a Technology Preview, " +
              "try enabling the 'WebRTC VP8 codec' setting in the 'Experimental Features' Develop menu",
          );
        }
      } else {
        // We do it in a very ugly way, as there's no alternative...
        // We create a PeerConnection to see if VP8 is in an offer
        const testpc = new RTCPeerConnection({});
        testpc.createOffer({ offerToReceiveVideo: true }).then(function (offer) {
          Janus.safariVp8 = offer.sdp.indexOf('VP8') !== -1;
          if (Janus.safariVp8) {
            console.log('This version of Safari supports VP8');
          } else {
            Janus.warn(
              "This version of Safari does NOT support VP8: if you're using a Technology Preview, " +
                "try enabling the 'WebRTC VP8 codec' setting in the 'Experimental Features' Develop menu",
            );
          }
          testpc.close();
          testpc = null;
        });
      }
    }
    // Check if this browser supports Unified Plan and transceivers
    // Based on https://codepen.io/anon/pen/ZqLwWV?editors=0010
    Janus.unifiedPlan = true;

    Janus.initDone = true;
    callback();
  }
};

export const constPluginHandle = ({ token, plugin, handleId, dataChannelOptions }) => ({
  session: this,
  plugin,
  id: handleId,
  token,
  detached: false,
  webrtcStuff: {
    started: false,
    myStream: null,
    streamExternal: false,
    remoteStream: null,
    mySdp: null,
    mediaConstraints: null,
    pc: null,
    dataChannelOptions,
    dataChannel: {},
    dtmfSender: null,
    trickle: true,
    iceDone: false,
    bitrate: {},
  },
  getId: function () {
    return handleId;
  },
  getPlugin: function () {
    return plugin;
  },
  getVolume: function (mid, result) {
    return getVolume(handleId, mid, true, result);
  },
  getRemoteVolume: function (mid, result) {
    return getVolume(handleId, mid, true, result);
  },
  getLocalVolume: function (mid, result) {
    return getVolume(handleId, mid, false, result);
  },
  isAudioMuted: function (mid) {
    return isMuted(handleId, mid, false);
  },
  muteAudio: function (mid) {
    return mute(handleId, mid, false, true);
  },
  unmuteAudio: function (mid) {
    return mute(handleId, mid, false, false);
  },
  isVideoMuted: function (mid) {
    return isMuted(handleId, mid, true);
  },
  muteVideo: function (mid) {
    return mute(handleId, mid, true, true);
  },
  unmuteVideo: function (mid) {
    return mute(handleId, mid, true, false);
  },
  getBitrate: function (mid) {
    return getBitrate(handleId, mid);
  },
  send: function (callbacks) {
    sendMessage(handleId, callbacks);
  },
  data: function (callbacks) {
    sendData(handleId, callbacks);
  },
  dtmf: function (callbacks) {
    sendDtmf(handleId, callbacks);
  },
  consentDialog: callbacks.consentDialog,
  iceState: callbacks.iceState,
  mediaState: callbacks.mediaState,
  webrtcState: callbacks.webrtcState,
  slowLink: callbacks.slowLink,
  onmessage: callbacks.onmessage,
  createOffer: function (callbacks) {
    prepareWebrtc(handleId, true, callbacks);
  },
  createAnswer: function (callbacks) {
    prepareWebrtc(handleId, false, callbacks);
  },
  handleRemoteJsep: function (callbacks) {
    prepareWebrtcPeer(handleId, callbacks);
  },
  onlocaltrack: callbacks.onlocaltrack,
  onremotetrack: callbacks.onremotetrack,
  ondata: callbacks.ondata,
  ondataopen: callbacks.ondataopen,
  oncleanup: callbacks.oncleanup,
  ondetached: callbacks.ondetached,
  hangup: function (sendRequest) {
    cleanupWebrtc(handleId, sendRequest === true);
  },
  detach: function (callbacks) {
    destroyHandle(handleId, callbacks);
  },
});

// Helper methods to parse a media object
function isAudioSendEnabled(media: any): boolean {
  Janus.debug('isAudioSendEnabled:', media);
  if (!media) return true; // Default
  if (media.audio === false) return false; // Generic audio has precedence
  if (media.audioSend === undefined || media.audioSend === null) return true; // Default
  return media.audioSend === true;
}

function isAudioSendRequired(media: any): boolean {
  Janus.debug('isAudioSendRequired:', media);
  if (!media) return false; // Default
  if (media.audio === false || media.audioSend === false) return false; // If we're not asking to capture audio, it's not required
  if (media.failIfNoAudio === undefined || media.failIfNoAudio === null) return false; // Default
  return media.failIfNoAudio === true;
}

function isAudioRecvEnabled(media: any): boolean {
  Janus.debug('isAudioRecvEnabled:', media);
  if (!media) return true; // Default
  if (media.audio === false) return false; // Generic audio has precedence
  if (media.audioRecv === undefined || media.audioRecv === null) return true; // Default
  return media.audioRecv === true;
}

function isVideoSendEnabled(media: any) {
  Janus.debug('isVideoSendEnabled:', media);
  if (!media) return true; // Default
  if (media.video === false) return false; // Generic video has precedence
  if (media.videoSend === undefined || media.videoSend === null) return true; // Default
  return media.videoSend === true;
}

function isVideoSendRequired(media: any) {
  Janus.debug('isVideoSendRequired:', media);
  if (!media) return false; // Default
  if (media.video === false || media.videoSend === false) return false; // If we're not asking to capture video, it's not required
  if (media.failIfNoVideo === undefined || media.failIfNoVideo === null) return false; // Default
  return media.failIfNoVideo === true;
}

function isVideoRecvEnabled(media: any) {
  Janus.debug('isVideoRecvEnabled:', media);
  if (!media) return true; // Default
  if (media.video === false) return false; // Generic video has precedence
  if (media.videoRecv === undefined || media.videoRecv === null) return true; // Default
  return media.videoRecv === true;
}

function isScreenSendEnabled(media: any) {
  Janus.debug('isScreenSendEnabled:', media);
  if (!media) return false;
  if (typeof media.video !== 'object' || typeof media.video.mandatory !== 'object') return false;
  var constraints = media.video.mandatory;
  if (constraints.chromeMediaSource)
    return constraints.chromeMediaSource === 'desktop' || constraints.chromeMediaSource === 'screen';
  else if (constraints.mozMediaSource)
    return constraints.mozMediaSource === 'window' || constraints.mozMediaSource === 'screen';
  else if (constraints.mediaSource) return constraints.mediaSource === 'window' || constraints.mediaSource === 'screen';
  return false;
}

function isDataEnabled(media: any) {
  Janus.debug('isDataEnabled:', media);
  if (Janus.webRTCAdapter.browserDetails.browser === 'edge') {
    Janus.warn("Edge doesn't support data channels yet");
    return false;
  }
  if (media === undefined || media === null) return false; // Default
  return media.data === true;
}

function isTrickleEnabled(trickle: boolean) {
  Janus.debug('isTrickleEnabled:', trickle);
  return trickle === false ? false : true;
}

export const randomString = function (length: number) {
  const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < length; i++) {
    const randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
};

// overrides for default maxBitrate values for simulcasting
export const getMaxBitrates = ({ high = 900000, medium = 300000, low = 100000 }) => ({
  high,
  medium,
  low,
});

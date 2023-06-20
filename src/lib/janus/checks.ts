export const isExtensionEnabled = function (): boolean {
  if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
    // No need for the extension, getDisplayMedia is supported
    return true;
  }
  if (window.navigator.userAgent.match('Chrome')) {
    const chromever = parseInt(window.navigator.userAgent.match(/Chrome\/(.*) /)[1], 10);
    let maxver = 33;
    if (window.navigator.userAgent.match('Linux')) maxver = 35; // "known" crash in chrome 34 and 35 on linux
    if (chromever >= 26 && chromever <= maxver) {
      // Older versions of Chrome don't support this extension-based approach, so lie
      return true;
    }
    return Janus.extension.isInstalled();
  } else {
    // Firefox and others, no need for the extension (but this doesn't mean it will work)
    return true;
  }
};

export const defaultExtension = {
  // Screensharing Chrome Extension ID
  extensionId: 'hapfgfdkleiggjjpfpenajgdnfckjpaj',
  isInstalled: function () {
    return document.querySelector('#janus-extension-installed') !== null;
  },
  getScreen: function (callback) {
    var pending = window.setTimeout(function () {
      var error = new Error('NavigatorUserMediaError');
      error.name =
        'The required Chrome extension is not installed: click <a href="#">here</a> to install it. (NOTE: this will need you to refresh the page)';
      return callback(error);
    }, 1000);
    this.cache[pending] = callback;
    window.postMessage({ type: 'janusGetScreen', id: pending }, '*');
  },
  init: function () {
    var cache = {};
    this.cache = cache;
    // Wait for events from the Chrome Extension
    window.addEventListener('message', function (event) {
      if (event.origin != window.location.origin) return;
      if (event.data.type == 'janusGotScreen' && cache[event.data.id]) {
        var callback = cache[event.data.id];
        delete cache[event.data.id];

        if (event.data.sourceId === '') {
          // user canceled
          var error = new Error('NavigatorUserMediaError');
          error.name = 'You cancelled the request for permission, giving up...';
          callback(error);
        } else {
          callback(null, event.data.sourceId);
        }
      } else if (event.data.type == 'janusGetScreenPending') {
        console.log('clearing ', event.data.id);
        window.clearTimeout(event.data.id);
      }
    });
  },
};

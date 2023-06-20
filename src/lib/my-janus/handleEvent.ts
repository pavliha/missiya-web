const transactions: Record<any, any> = {};
const pluginHandles: Record<any, any> = {};
const handlers = {
  keepalive: () => console.log('keepalive'),
  server_info: (json: any) => {
    const transaction = json['transaction'];
    if (transaction) {
      const reportSuccess = transactions[transaction];
      if (reportSuccess) reportSuccess(json);
      delete transactions[transaction];
    }
  },
  ack: (json: any) => {
    const transaction = json['transaction'];
    if (transaction) {
      const reportSuccess = transactions[transaction];
      if (reportSuccess) reportSuccess(json);
      delete transactions[transaction];
    }
  },

  success: (json: any) => {
    const transaction = json['transaction'];
    if (transaction) {
      const reportSuccess = transactions[transaction];
      if (reportSuccess) reportSuccess(json);
      delete transactions[transaction];
    }
  },
};

export function handleEvent(json, skipTimeout) {
  if (json['janus'] === 'keepalive') {
    // Nothing happened
    Janus.vdebug('Got a keepalive on session ' + sessionId);
    return;
  } else if (json['janus'] === 'server_info') {
    // Just info on the Janus instance
    Janus.debug('Got info on the Janus instance');
    Janus.debug(json);
    const transaction = json['transaction'];
    if (transaction) {
      const reportSuccess = transactions[transaction];
      if (reportSuccess) reportSuccess(json);
      delete transactions[transaction];
    }
    return;
  } else if (json['janus'] === 'ack') {
    // Just an ack, we can probably ignore
    Janus.debug('Got an ack on session ' + sessionId);
    Janus.debug(json);
    const transaction = json['transaction'];
    if (transaction) {
      const reportSuccess = transactions[transaction];
      if (reportSuccess) reportSuccess(json);
      delete transactions[transaction];
    }
    return;
  } else if (json['janus'] === 'success') {
    // Success!
    Janus.debug('Got a success on session ' + sessionId);
    Janus.debug(json);
    const transaction = json['transaction'];
    if (transaction) {
      const reportSuccess = transactions[transaction];
      if (reportSuccess) reportSuccess(json);
      delete transactions[transaction];
    }
    return;
  } else if (json['janus'] === 'trickle') {
    // We got a trickle candidate from Janus
    const sender = json['sender'];
    if (!sender) {
      Janus.warn('Missing sender...');
      return;
    }
    const pluginHandle = pluginHandles[sender];
    if (!pluginHandle) {
      Janus.debug('This handle is not attached to this session');
      return;
    }
    var candidate = json['candidate'];
    Janus.debug('Got a trickled candidate on session ' + sessionId);
    Janus.debug(candidate);
    var config = pluginHandle.webrtcStuff;
    if (config.pc && config.remoteSdp) {
      // Add candidate right now
      Janus.debug('Adding remote candidate:', candidate);
      if (!candidate || candidate.completed === true) {
        // end-of-candidates
        config.pc.addIceCandidate(Janus.endOfCandidates);
      } else {
        // New candidate
        config.pc.addIceCandidate(candidate);
      }
    } else {
      // We didn't do setRemoteDescription (trickle got here before the offer?)
      Janus.debug("We didn't do setRemoteDescription (trickle got here before the offer?), caching candidate");
      if (!config.candidates) config.candidates = [];
      config.candidates.push(candidate);
      Janus.debug(config.candidates);
    }
  } else if (json['janus'] === 'webrtcup') {
    // The PeerConnection with the server is up! Notify this
    Janus.debug('Got a webrtcup event on session ' + sessionId);
    Janus.debug(json);
    const sender = json['sender'];
    if (!sender) {
      Janus.warn('Missing sender...');
      return;
    }
    const pluginHandle = pluginHandles[sender];
    if (!pluginHandle) {
      Janus.debug('This handle is not attached to this session');
      return;
    }
    pluginHandle.webrtcState(true);
    return;
  } else if (json['janus'] === 'hangup') {
    // A plugin asked the core to hangup a PeerConnection on one of our handles
    Janus.debug('Got a hangup event on session ' + sessionId);
    Janus.debug(json);
    const sender = json['sender'];
    if (!sender) {
      Janus.warn('Missing sender...');
      return;
    }
    const pluginHandle = pluginHandles[sender];
    if (!pluginHandle) {
      Janus.debug('This handle is not attached to this session');
      return;
    }
    pluginHandle.webrtcState(false, json['reason']);
    pluginHandle.hangup();
  } else if (json['janus'] === 'detached') {
    // A plugin asked the core to detach one of our handles
    Janus.debug('Got a detached event on session ' + sessionId);
    Janus.debug(json);
    const sender = json['sender'];
    if (!sender) {
      Janus.warn('Missing sender...');
      return;
    }
    const pluginHandle = pluginHandles[sender];
    if (!pluginHandle) {
      // Don't warn here because destroyHandle causes this situation.
      return;
    }
    pluginHandle.ondetached();
    pluginHandle.detach();
  } else if (json['janus'] === 'media') {
    // Media started/stopped flowing
    Janus.debug('Got a media event on session ' + sessionId);
    Janus.debug(json);
    const sender = json['sender'];
    if (!sender) {
      Janus.warn('Missing sender...');
      return;
    }
    const pluginHandle = pluginHandles[sender];
    if (!pluginHandle) {
      Janus.debug('This handle is not attached to this session');
      return;
    }
    pluginHandle.mediaState(json['type'], json['receiving'], json['mid']);
  } else if (json['janus'] === 'slowlink') {
    Janus.debug('Got a slowlink event on session ' + sessionId);
    Janus.debug(json);
    // Trouble uplink or downlink
    const sender = json['sender'];
    if (!sender) {
      Janus.warn('Missing sender...');
      return;
    }
    const pluginHandle = pluginHandles[sender];
    if (!pluginHandle) {
      Janus.debug('This handle is not attached to this session');
      return;
    }
    pluginHandle.slowLink(json['uplink'], json['lost'], json['mid']);
  } else if (json['janus'] === 'error') {
    // Oops, something wrong happened
    Janus.error('Ooops: ' + json['error'].code + ' ' + json['error'].reason); // FIXME
    Janus.debug(json);
    var transaction = json['transaction'];
    if (transaction) {
      var reportSuccess = transactions[transaction];
      if (reportSuccess) {
        reportSuccess(json);
      }
      delete transactions[transaction];
    }
    return;
  } else if (json['janus'] === 'event') {
    Janus.debug('Got a plugin event on session ' + sessionId);
    Janus.debug(json);
    const sender = json['sender'];
    if (!sender) {
      Janus.warn('Missing sender...');
      return;
    }
    var plugindata = json['plugindata'];
    if (!plugindata) {
      Janus.warn('Missing plugindata...');
      return;
    }
    Janus.debug('  -- Event is coming from ' + sender + ' (' + plugindata['plugin'] + ')');
    var data = plugindata['data'];
    Janus.debug(data);
    const pluginHandle = pluginHandles[sender];
    if (!pluginHandle) {
      Janus.warn('This handle is not attached to this session');
      return;
    }
    var jsep = json['jsep'];
    if (jsep) {
      Janus.debug('Handling SDP as well...');
      Janus.debug(jsep);
    }
    var callback = pluginHandle.onmessage;
    if (callback) {
      Janus.debug('Notifying application...');
      // Send to callback specified when attaching plugin handle
      callback(data, jsep);
    } else {
      // Send to generic callback (?)
      Janus.debug('No provided notification callback');
    }
  } else if (json['janus'] === 'timeout') {
    Janus.error('Timeout on session ' + sessionId);
    Janus.debug(json);
    if (websockets) {
      ws.close(3504, 'Gateway timeout');
    }
    return;
  } else {
    Janus.warn("Unknown message/event  '" + json['janus'] + "' on session " + sessionId);
    Janus.debug(json);
  }
}

export function createSession({server}) {
  var transaction = Janus.randomString(12);
  var request = { janus: 'create', transaction: transaction };
  if (callbacks['reconnect']) {
    // We're reconnecting, claim the session
    connected = false;
    request['janus'] = 'claim';
    request['session_id'] = sessionId;
    // If we were using websockets, ignore the old connection
    if (ws) {
      ws.onopen = null;
      ws.onerror = null;
      ws.onclose = null;
      if (wsKeepaliveTimeoutId) {
        clearTimeout(wsKeepaliveTimeoutId);
        wsKeepaliveTimeoutId = null;
      }
    }
  }
  if (token) request['token'] = token;
  if (apisecret) request['apisecret'] = apisecret;
  if (!server && Janus.isArray(servers)) {
    // We still need to find a working server from the list we were given
    server = servers[serversIndex];
    if (server.indexOf('ws') === 0) {
      websockets = true;
      Janus.log('Server #' + (serversIndex + 1) + ': trying WebSockets to contact Janus (' + server + ')');
    } else {
      websockets = false;
      Janus.log('Server #' + (serversIndex + 1) + ': trying REST API to contact Janus (' + server + ')');
    }
  }
  if (websockets) {
    ws = Janus.newWebSocket(server, 'janus-protocol');
    wsHandlers = {
      error: function () {
        Janus.error('Error connecting to the Janus WebSockets server... ' + server);
        if (Janus.isArray(servers) && !callbacks['reconnect']) {
          serversIndex++;
          if (serversIndex === servers.length) {
            // We tried all the servers the user gave us and they all failed
            callbacks.error('Error connecting to any of the provided Janus servers: Is the server down?');
            return;
          }
          // Let's try the next server
          server = null;
          setTimeout(function () {
            createSession(callbacks);
          }, 200);
          return;
        }
        callbacks.error('Error connecting to the Janus WebSockets server: Is the server down?');
      },

      open: function () {
        // We need to be notified about the success
        transactions[transaction] = function (json) {
          Janus.debug(json);
          if (json['janus'] !== 'success') {
            Janus.error('Ooops: ' + json['error'].code + ' ' + json['error'].reason); // FIXME
            callbacks.error(json['error'].reason);
            return;
          }
          wsKeepaliveTimeoutId = setTimeout(keepAlive, keepAlivePeriod);
          connected = true;
          sessionId = json['session_id'] ? json['session_id'] : json.data['id'];
          if (callbacks['reconnect']) {
            Janus.log('Claimed session: ' + sessionId);
          } else {
            Janus.log('Created session: ' + sessionId);
          }
          Janus.sessions[sessionId] = that;
          callbacks.success();
        };
        ws.send(JSON.stringify(request));
      },

      message: function (event) {
        handleEvent(JSON.parse(event.data));
      },

      close: function () {
        if (!server || !connected) {
          return;
        }
        connected = false;
        // FIXME What if this is called when the page is closed?
        gatewayCallbacks.error('Lost connection to the server (is it down?)');
      },
    };

    for (var eventName in wsHandlers) {
      ws.addEventListener(eventName, wsHandlers[eventName]);
    }

    return;
  }
  fetch(server, {
    verb: 'POST',
    body: JSON.stringify(request),
  }).then(response=>{
    const json = response.json()
    if(json.success) throw Error(`Ooops: ${json['error'].code} ${json['error'].reason}`)
    const sessionId = json.session_id
  }).catch(console.error)


    success: function (json) {
      Janus.debug(json);
      if (json['janus'] !== 'success') {
        Janus.error('Ooops: ' + json['error'].code + ' ' + json['error'].reason); // FIXME
        callbacks.error(json['error'].reason);
        return;
      }
      connected = true;
      sessionId = json['session_id'] ? json['session_id'] : json.data['id'];
      if (callbacks['reconnect']) {
        Janus.log('Claimed session: ' + sessionId);
      } else {
        Janus.log('Created session: ' + sessionId);
      }
      Janus.sessions[sessionId] = that;
      eventHandler();
      callbacks.success();
    },
    error: function (textStatus, errorThrown) {
      Janus.error(textStatus + ':', errorThrown); // FIXME
      if (Janus.isArray(servers) && !callbacks['reconnect']) {
        serversIndex++;
        if (serversIndex === servers.length) {
          // We tried all the servers the user gave us and they all failed
          callbacks.error('Error connecting to any of the provided Janus servers: Is the server down?');
          return;
        }
        // Let's try the next server
        server = null;
        setTimeout(function () {
          createSession(callbacks);
        }, 200);
        return;
      }
      if (errorThrown === '') callbacks.error(textStatus + ': Is the server down?');
      else callbacks.error(textStatus + ': ' + errorThrown);
    },
  });
}

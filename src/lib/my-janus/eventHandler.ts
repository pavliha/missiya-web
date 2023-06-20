let retries = 1;
export function eventHandler({ sessionId, server, maxev, token, apisecret, onEvent }) {
  if (sessionId == null) return;
  Janus.debug('Long poll...');

  var longpoll = server + '/' + sessionId + '?rid=' + new Date().getTime();
  if (maxev) longpoll = longpoll + '&maxev=' + maxev;
  if (token) longpoll = longpoll + '&token=' + encodeURIComponent(token);
  if (apisecret) longpoll = longpoll + '&apisecret=' + encodeURIComponent(apisecret);

  fetch(longpoll)
    .then(onEvent)
    .catch(async (error) => {
      retries++;
      if (retries > 3) throw new Error('Lost connection to the server (is it down?)');
      eventHandler({ sessionId, server, maxev, token, apisecret, onEvent });
    });
}

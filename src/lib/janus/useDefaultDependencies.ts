import { defaultExtension } from './defaultExtension';

export const useDefaultDependencies = function ({ adapter }: any) {
  return {
    extension: defaultExtension,

    webRTCAdapter: adapter,
    httpAPICall: function (url: string, options: any) {
      const fetchOptions: RequestInit = {
        method: options.verb,
        headers: {
          Accept: 'application/json, text/plain, */*',
        },
        cache: 'no-cache',
      };
      if (options.verb === 'POST') {
        fetchOptions.headers['Content-Type'] = 'application/json';
      }
      if (options.withCredentials !== undefined) {
        fetchOptions.credentials =
          options.withCredentials === true ? 'include' : options.withCredentials ? options.withCredentials : 'omit';
      }
      if (options.body) {
        fetchOptions.body = JSON.stringify(options.body);
      }

      const fetching = fetch(url, fetchOptions).catch(function (error: any) {
        return Promise.reject({ message: 'Probably a network error, is the server down?', error: error });
      });

      /*
       * fetch() does not natively support timeouts.
       * Work around this by starting a timeout manually, and racing it against the fetch() to see which thing resolves first.
       */

      if (options.timeout) {
        const timeout = new p(function (resolve, reject) {
          const timerId = setTimeout(function () {
            clearTimeout(timerId);
            return reject({ message: 'Request timed out', timeout: options.timeout });
          }, options.timeout);
        });
        fetching = p.race([fetching, timeout]);
      }

      fetching
        .then(function (response: Response) {
          if (response.ok) {
            if (typeof options.success === typeof Janus.noop) {
              return response.json().then(
                function (parsed: any) {
                  try {
                    options.success(parsed);
                  } catch (error) {
                    Janus.error('Unhandled httpAPICall success callback error', error);
                  }
                },
                function (error) {
                  return Promise.reject({ message: 'Failed to parse response body', error: error, response: response });
                },
              );
            }
          } else {
            return Promise.reject({ message: 'API call failed', response: response });
          }
        })
        .catch(function (error: any) {
          if (typeof options.error === typeof Janus.noop) {
            options.error(error.message || '<< internal error >>', error);
          }
        });

      return fetching;
    },
  };
};

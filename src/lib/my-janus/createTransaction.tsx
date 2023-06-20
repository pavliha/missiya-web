import { randomString } from '../janus/helpers';

export const createTransaction = async () => {
  const url = 'https://mq23z0000001.api.missiya.com/janus';
  await fetch(url, { method: 'POST', body: JSON.stringify({ janus: 'create', transaction: randomString(12) }) });
};

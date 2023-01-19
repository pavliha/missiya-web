import type { NextApiResponse } from 'next';
import { METHODS } from 'src/server/constants';

export const setCorsHeaders = (res: NextApiResponse): void => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', `${METHODS.OPTIONS}, ${METHODS.GET}, ${METHODS.POST}`);
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Content-Type', 'application/json');
};

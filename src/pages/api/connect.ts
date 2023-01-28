// noinspection ExceptionCaughtLocallyJS

import type { NextApiRequest, NextApiResponse } from 'next';
import { setCorsHeaders } from 'src/utils/setCorsHeaders';
import { METHODS } from 'src/server/constants';
// import { prisma } from 'src/server/db';
import { findFreePorts } from 'find-free-ports';

interface ConnectRequestBody {
  droneID: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  setCorsHeaders(res);
  if (req.method !== METHODS.POST) return res.status(400).json({ error: 'Use POST method' });

  const { droneID } = req.body as ConnectRequestBody;
  try {
    if (!droneID) throw new Error('No Drone ID');
    // await prisma.example.create({
    //   data: {
    //     droneID,
    //   },
    // });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
    const ports = await findFreePorts(4);

    res.status(200).json({
      port: JSON.stringify(ports),
    });
  } catch (error: unknown) {
    res.status(400).json({ error: (error as Error).message });
  } finally {
    res.end();
  }
}

import type { NextApiRequest, NextApiResponse } from 'next';
import { setCorsHeaders } from 'src/utils/setCorsHeaders';
import { METHODS } from 'src/server/constants';
import { prisma } from 'src/server/db';

interface ConnectRequestBody {
  droneID: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  setCorsHeaders(res);
  if (req.method !== METHODS.POST) return res.status(400).json({ error: 'Use POST method' });

  const { droneID } = req.body as ConnectRequestBody;
  try {
    if (!droneID) throw new Error('No Drone ID');
    await prisma.example.create({
      data: {
        droneID,
      },
    });
    res.status(200).json({ port: 8088 });
  } catch (error: unknown) {
    res.status(400).json({ error: (error as Error).message });
  } finally {
    res.end();
  }
}

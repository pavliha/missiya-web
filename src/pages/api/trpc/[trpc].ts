import type { NextApiRequest } from 'next';
import { type AnyRouter } from '@trpc/server';
import { type OnErrorFunction } from '@trpc/server/src/internals/types';
import { createNextApiHandler } from '@trpc/server/adapters/next';
import type { Prisma, PrismaClient } from '@prisma/client';
import { env } from 'src/env/server.mjs';
import { appRouter } from 'src/server/api/root';
import { prisma } from 'src/server/db';

interface TRouter extends AnyRouter {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
}

const createContext = () => ({
  prisma,
});

const onError: OnErrorFunction<TRouter, NextApiRequest> | undefined = ({ path, error }) => {
  if (env.NODE_ENV !== 'development') return undefined;
  console.error(`❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`);
};

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext,
  onError,
});

import { createNextApiHandler } from '@trpc/server/adapters/next';
import { env } from 'src/env/server.mjs';
import { appRouter } from 'src/server/api/root';
import { prisma } from 'src/server/db';

/**
 * This is the actual context you'll use in your router. It will be used to
 * process every request that goes through your tRPC endpoint
 * @link https://trpc.io/docs/context
 */

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: () => ({
    prisma,
  }),
  onError:
    env.NODE_ENV === 'development'
      ? ({ path, error }) => {
          console.error(`❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`);
        }
      : undefined,
});

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { TRPCError, initTRPC } from '@trpc/server';
import { getServerSession } from 'next-auth';
import superjson from 'superjson';
const t = initTRPC.create({ transformer: superjson });

const middleware = t.middleware;
const isAuth = middleware(async opts => {
  const session = await getServerSession(authOptions);

  if (!session?.user || !session?.user?.email) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    });
  }
  return opts.next({
    ctx: {
      session,
      userId: session.user.id as number,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuth);

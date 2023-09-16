import { prisma } from './prisma';
import { publicProcedure, router } from './trpc';
import { z } from 'zod';

export const appRouter = router({
  hello: publicProcedure.query(async () => {
    return `Hello from server !`;
  }),
  setName: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input }) => {
      const user = await prisma.user.create({
        data: {
          name: input.name,
          email: input.name,
        },
      });
      return user;
    }),
});

export type AppRouter = typeof appRouter;

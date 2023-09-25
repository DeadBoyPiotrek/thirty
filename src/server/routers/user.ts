import { prisma } from '../prisma';
import { router, publicProcedure } from '../trpc';
export const userRouter = router({
  getAllUsers: publicProcedure.query(() => {
    const users = prisma.user.findMany();
    return users;
  }),
});

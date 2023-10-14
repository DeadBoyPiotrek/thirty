import { TRPCError } from '@trpc/server';
import { prisma } from '../prisma';
import { router, publicProcedure, protectedProcedure } from '../trpc';
export const userRouter = router({
  getAllUsers: publicProcedure.query(() => {
    const users = prisma.user.findMany();
    return users;
  }),
  getUserProfileId: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }
    return user.profileId;
  }),
});

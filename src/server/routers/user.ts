import { TRPCError } from '@trpc/server';
import { prisma } from '../prisma';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { z } from 'zod';
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

  searchForUsers: protectedProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      const users = prisma.user.findMany({
        select: {
          name: true,
          profileId: true,
          image: true,
        },

        where: {
          name: { contains: input.name, mode: 'insensitive' },
        },
      });

      return users;
    }),

  getUserProfile: protectedProcedure
    .input(z.object({ profileId: z.string() }))
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: {
          profileId: input.profileId,
        },
        select: {
          name: true,
          profileId: true,
          image: true,
          friends: true,
          quests: true,
          profilePrivate: true,
        },
      });

      return user;
    }),
});

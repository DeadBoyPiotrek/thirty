import { userProfileSchemaImgUrl } from '@/lib/schemas/userProfileSchema';
import { prisma } from '../prisma';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { z } from 'zod';
export const userRouter = router({
  getAllUsers: publicProcedure.query(() => {
    const users = prisma.user.findMany();
    return users;
  }),

  searchForUsers: protectedProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      const users = prisma.user.findMany({
        where: {
          name: { contains: input.name, mode: 'insensitive' },
        },
        select: {
          name: true,
          id: true,
          image: true,
        },
      });

      return users;
    }),

  getUserProfile: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: {
          id: input.userId,
        },
        select: {
          name: true,
          bio: true,
          image: true,
          friends: true,
          quests: true,
          profilePrivate: true,
        },
      });

      return user;
    }),

  updateProfile: protectedProcedure
    .input(userProfileSchemaImgUrl)
    .mutation(async ({ ctx, input }) => {
      const user = await prisma.user.update({
        where: {
          id: ctx.userId,
        },
        data: {
          name: input.name,
          bio: input.bio,
          image: input.imageURL,
          profilePrivate: input.profilePrivate,
        },
      });

      return user;
    }),
});

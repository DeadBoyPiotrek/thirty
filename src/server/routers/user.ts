import { userProfileSchemaImgUrl } from '@/lib/schemas/userProfileSchema';
import { prisma } from '../prisma';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { z } from 'zod';

export const userRouter = router({
  getAllUsers: publicProcedure.query(async () => {
    const users = await prisma.user.findMany();
    return users;
  }),

  searchForUsers: protectedProcedure
    .input(z.object({ name: z.string().max(50) }))
    .query(async ({ input }) => {
      if (input.name.length < 1) {
        return [];
      }

      const users = await prisma.user.findMany({
        where: {
          name: { contains: input.name, mode: 'insensitive' },
        },
        select: {
          name: true,
          id: true,
          imageUrl: true,
        },
      });

      return users;
    }),

  getUserProfile: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: {
          id: input.userId,
        },
        select: {
          name: true,
          bio: true,
          imageName: true,
          imageUrl: true,
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
          image: input.imageUrl,
          imageUrl: input.imageUrl,
          imageName: input.imageName,
          profilePrivate: input.profilePrivate,
        },
      });

      return user;
    }),

  userExists: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: {
          id: input.userId,
        },
        select: {
          id: true,
          name: true,
        },
      });

      return user;
    }),
});

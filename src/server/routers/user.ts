import { userProfileSchemaImgUrl } from '@/lib/schemas/userProfileSchema';
import { prisma } from '../prisma';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { deleteImage } from '@/lib/helpers/images/deleteImage';

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
          friends: {
            select: {
              name: true,
              id: true,
              imageUrl: true,
            },
          },
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

  deleteProfile: protectedProcedure
    .input(z.object({ userImageName: z.string().nullish() }))
    .mutation(async ({ ctx, input }) => {
      const postsImagesNames = await prisma.post.findMany({
        where: {
          userId: ctx.userId,
        },
        select: {
          imageName: true,
        },
      });

      const questsImagesNames = await prisma.quest.findMany({
        where: {
          userId: ctx.userId,
        },
        select: {
          imageName: true,
        },
      });

      const filteredPostsImagesNames = postsImagesNames
        .filter(image => image.imageName !== null)
        .map(image => ({
          imageName: image.imageName as string,
          folder: 'posts' as 'posts',
        }));
      const filteredQuestsImagesNames = questsImagesNames
        .filter(image => image.imageName !== null)
        .map(image => ({
          imageName: image.imageName as string,
          folder: 'quests' as 'quests',
        }));

      for (const image of filteredPostsImagesNames) {
        await deleteImage({
          folderName: image.folder,
          imageName: image.imageName,
        });
      }

      for (const image of filteredQuestsImagesNames) {
        await deleteImage({
          folderName: image.folder,
          imageName: image.imageName,
        });
      }

      await deleteImage({
        folderName: 'avatars',
        imageName: input.userImageName as string,
      });

      await prisma.user.delete({
        where: {
          id: ctx.userId,
        },
      });
    }),
});

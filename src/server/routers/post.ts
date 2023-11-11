import {
  postFormSchemaImgName,
  postFormSchemaImgNameEdit,
} from '@/lib/schemas/postFormSchema';
import { protectedProcedure, router } from '../trpc';
import { prisma } from '../prisma';
import { z } from 'zod';
export const postRouter = router({
  addPost: protectedProcedure
    .input(postFormSchemaImgName)
    .mutation(async ({ ctx, input }) => {
      const post = await prisma.post.create({
        data: {
          title: input.title,
          content: input.content,
          imageUrl: input.imageUrl,
          imageName: input.imageName,

          user: {
            connect: {
              id: ctx.userId,
            },
          },
          quest: {
            connect: {
              id: input.questId,
            },
          },
        },
      });

      return post;
    }),

  updatePost: protectedProcedure
    .input(postFormSchemaImgNameEdit)
    .mutation(async ({ ctx, input }) => {
      const post = await prisma.post.update({
        where: {
          id: input.id,
          AND: {
            userId: ctx.userId,
          },
        },
        data: {
          title: input.title,
          content: input.content,
          imageUrl: input.imageUrl,
          imageName: input.imageName,
        },
      });

      return post;
    }),

  deletePost: protectedProcedure
    .input(postFormSchemaImgNameEdit.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const post = await prisma.post.delete({
        where: {
          id: input.id,
          AND: {
            userId: ctx.userId,
          },
        },
      });

      return post;
    }),

  getFeedPosts: protectedProcedure
    .input(z.object({ page: z.number() }))
    .query(async ({ ctx }) => {
      const posts = await prisma.post.findMany({
        orderBy: {
          datePublished: 'desc',
        },
        take: 4,
        where: {
          OR: [
            {
              userId: ctx.userId,
            },
            {
              user: {
                friends: {
                  some: {
                    id: ctx.userId,
                  },
                },
              },
            },
          ],
        },
        select: {
          id: true,
          title: true,
          content: true,
          imageUrl: true,
          imageName: true,
          datePublished: true,
          user: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },
          quest: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });
      return posts;
    }),
});

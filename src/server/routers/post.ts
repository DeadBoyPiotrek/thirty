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
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const posts = await prisma.post.findMany({
        take: input.limit ?? 5,
        skip: input.cursor ? 1 : 0,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: {
          id: 'desc',
        },
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
      return {
        posts,
        cursor: posts[posts.length - 1]?.id ?? null,
      };
    }),
});

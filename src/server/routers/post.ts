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
        limit: z.number().min(1).max(10).nullish(),
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
          likes: {
            select: {
              id: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true,
                },
              },
            },
          },
          comments: {
            take: 1,
            orderBy: {
              datePublished: 'desc',
            },
            select: {
              id: true,
              content: true,
              datePublished: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true,
                },
              },
            },
          },
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

      // TODO: seems expensive
      const commentsAmount = await Promise.all(
        posts.map(async post => {
          return await prisma.comment.count({
            where: {
              postId: post.id,
            },
          });
        })
      );
      const postsWithCommentsAmount = posts.map((post, index) => {
        return {
          ...post,
          commentsAmount: commentsAmount[index],
        };
      });

      return {
        posts: postsWithCommentsAmount,
        cursor: posts[posts.length - 1]?.id ?? null,
      };
    }),

  getUserPageFeedPosts: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(10).nullish(),
        cursor: z.number().nullish(),
        userId: z.number(),
      })
    )
    .query(async ({ input }) => {
      const posts = await prisma.post.findMany({
        take: input.limit ?? 5,
        skip: input.cursor ? 1 : 0,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: {
          id: 'desc',
        },
        where: {
          userId: input.userId,
        },

        select: {
          id: true,
          title: true,
          content: true,
          imageUrl: true,
          imageName: true,
          datePublished: true,
          likes: {
            select: {
              id: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true,
                },
              },
            },
          },
          comments: {
            take: 1,
            orderBy: {
              datePublished: 'desc',
            },
            select: {
              id: true,
              content: true,
              datePublished: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true,
                },
              },
            },
          },

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

      const commentsAmount = await Promise.all(
        posts.map(async post => {
          return await prisma.comment.count({
            where: {
              postId: post.id,
            },
          });
        })
      );

      const postsWithCommentsAmount = posts.map((post, index) => {
        return {
          ...post,
          commentsAmount: commentsAmount[index],
        };
      });

      return {
        posts: postsWithCommentsAmount,
        cursor: posts[posts.length - 1]?.id ?? null,
      };
    }),

  likePost: protectedProcedure
    .input(
      z.object({
        postId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if the user has already liked the post
      const existingLike = await prisma.like.findFirst({
        where: {
          userId: ctx.userId,
          postId: input.postId,
        },
      });

      if (existingLike) {
        // If a like exists, remove it (unlike)
        await prisma.like.delete({
          where: { id: existingLike.id },
        });
        return { message: 'Post unliked successfully' };
      } else {
        // If no like exists, add a new like
        const newLike = await prisma.like.create({
          data: {
            user: {
              connect: {
                id: ctx.userId,
              },
            },
            post: {
              connect: {
                id: input.postId,
              },
            },
          },
        });
        return { message: 'Post liked successfully', like: newLike };
      }
    }),

  addComment: protectedProcedure
    .input(
      z.object({
        postId: z.number(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const comment = await prisma.comment.create({
        data: {
          content: input.content,
          user: {
            connect: {
              id: ctx.userId,
            },
          },
          post: {
            connect: {
              id: input.postId,
            },
          },
        },
      });

      return comment;
    }),
  deleteComment: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const comment = await prisma.comment.delete({
        where: {
          id: input.id,
          AND: {
            userId: ctx.userId,
          },
        },
      });

      return comment;
    }),
  updateComment: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const comment = await prisma.comment.update({
        where: {
          id: input.id,
          AND: {
            userId: ctx.userId,
          },
        },
        data: {
          content: input.content,
        },
      });

      return comment;
    }),

  loadMoreComments: protectedProcedure
    .input(
      z.object({
        postId: z.number(),
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(),
      })
    )

    .query(async ({ input }) => {
      const comments = await prisma.comment.findMany({
        take: input.limit ?? 5,
        skip: input.cursor ? 1 : 0,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: {
          datePublished: 'desc',
        },
        where: {
          postId: input.postId,
        },
        select: {
          id: true,
          content: true,
          datePublished: true,
          user: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },
        },
      });

      const commentsAmount = await prisma.comment.count({
        where: {
          postId: input.postId,
        },
      });

      return {
        comments,
        commentsAmount,
        cursor: comments[comments.length - 1]?.id ?? null,
      };
    }),
});

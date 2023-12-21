import {
  questFormSchemaImgName,
  questFormSchemaImgNameEdit,
} from '@/lib/schemas/questFormSchema';
import { protectedProcedure, router } from '../trpc';
import { prisma } from '../prisma';
import { z } from 'zod';

export const questRouter = router({
  addQuest: protectedProcedure
    .input(questFormSchemaImgName)
    .mutation(async ({ ctx, input }) => {
      const quest = await prisma.quest.create({
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
        },
      });

      return quest;
    }),

  getQuests: protectedProcedure
    .input(z.object({ userId: z.number().int() }))
    .query(async ({ input }) => {
      const quests = await prisma.quest.findMany({
        where: {
          userId: input.userId,
        },
        orderBy: {
          datePublished: 'desc',
        },
        select: {
          id: true,
          title: true,
          content: true,
          imageUrl: true,
          datePublished: true,
          userId: true,
        },
      });

      return quests;
    }),

  getQuestsForPostForm: protectedProcedure.query(async ({ ctx }) => {
    const quests = await prisma.quest.findMany({
      orderBy: {
        datePublished: 'desc',
      },
      where: {
        userId: ctx.userId,
      },
      select: {
        id: true,
        title: true,
      },
    });

    return quests;
  }),

  getSingleQuestWithPosts: protectedProcedure
    .input(z.object({ userId: z.number().int(), questId: z.number().int() }))
    .query(async ({ input }) => {
      const quest = await prisma.quest.findFirst({
        where: {
          userId: input.userId,
          id: input.questId,
        },
        select: {
          id: true,
          title: true,
          content: true,
          imageName: true,
          imageUrl: true,
          datePublished: true,
          posts: {
            orderBy: {
              datePublished: 'desc',
            },
            select: {
              id: true,
              title: true,
              content: true,
              imageName: true,
              imageUrl: true,
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
              user: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true,
                },
              },
            },
          },
        },
      });

      return quest;
    }),

  deleteQuest: protectedProcedure
    .input(z.object({ questId: z.number().int() }))
    .mutation(async ({ input, ctx }) => {
      const quest = await prisma.quest.delete({
        where: {
          id: input.questId,
          AND: {
            userId: ctx.userId,
          },
        },
      });

      return quest;
    }),

  updateQuest: protectedProcedure
    .input(questFormSchemaImgNameEdit)
    .mutation(async ({ input, ctx }) => {
      const quest = await prisma.quest.update({
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
        },
      });

      return quest;
    }),
});

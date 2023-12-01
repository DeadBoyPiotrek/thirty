import { questFormSchemaImgUrl } from '@/lib/schemas/questFormSchema';
import { protectedProcedure, router } from '../trpc';
import { prisma } from '../prisma';
import { z } from 'zod';

export const questRouter = router({
  addQuest: protectedProcedure
    .input(questFormSchemaImgUrl)
    .mutation(async ({ ctx, input }) => {
      const quest = await prisma.quest.create({
        data: {
          title: input.title,
          content: input.content,
          imageUrl: input.imageUrl,

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

  getSingleQuestWithPost: protectedProcedure
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
              imageUrl: true,
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
        },
      });

      return quest;
    }),
});

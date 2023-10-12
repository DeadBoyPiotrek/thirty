import { questFormSchemaImgUrl } from '@/lib/schemas/questFormSchema';
import { protectedProcedure, router } from '../trpc';
import { prisma } from '../prisma';

export const questRouter = router({
  addQuest: protectedProcedure
    .input(questFormSchemaImgUrl)
    .mutation(async ({ ctx, input }) => {
      const quest = await prisma.quest.create({
        data: {
          title: input.title,
          content: input.content,
          image: input.imageURL,

          user: {
            connect: {
              id: ctx.userId,
            },
          },
        },
      });

      return quest;
    }),

  getMyQuests: protectedProcedure.query(async ({ ctx }) => {
    const quests = await prisma.quest.findMany({
      where: {
        userId: ctx.userId,
      },
    });

    const questsWithDateString = quests.map(quest => {
      return {
        ...quest,
        datePublished: quest.datePublished.toISOString(),
      };
    });

    return questsWithDateString;
  }),
});

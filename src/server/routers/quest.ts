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

  getMyQuestsWPosts: protectedProcedure.query(async ({ ctx }) => {
    const quests = await prisma.quest.findMany({
      where: {
        userId: ctx.userId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        datePublished: true,
        posts: {
          select: {
            id: true,
            title: true,
            content: true,
            image: true,
            datePublished: true,
          },
        },
      },
    });
    // TODO - can it be done in a better way?
    const questsWithDateString = quests.map(quest => {
      return {
        ...quest,
        datePublished: quest.datePublished.toISOString(),
        posts: quest.posts.map(post => {
          return {
            ...post,
            datePublished: post.datePublished.toISOString(),
          };
        }),
      };
    });

    return questsWithDateString;
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
});

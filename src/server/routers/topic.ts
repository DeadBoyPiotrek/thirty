import { topicFormSchemaImgUrl } from '@/app/lib/schemas/topicFormSchema';
import { protectedProcedure, router } from '../trpc';
import { prisma } from '../prisma';

export const topicRouter = router({
  addTopic: protectedProcedure
    .input(topicFormSchemaImgUrl)
    .mutation(async ({ ctx, input }) => {
      const topic = await prisma.topic.create({
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

      return topic;
    }),

  getMyTopics: protectedProcedure.query(async ({ ctx }) => {
    const topics = await prisma.topic.findMany({
      where: {
        userId: ctx.userId,
      },
    });

    const topicsWithDateString = topics.map(topic => {
      return {
        ...topic,
        datePublished: topic.datePublished.toISOString(),
      };
    });

    return topicsWithDateString;
  }),
});

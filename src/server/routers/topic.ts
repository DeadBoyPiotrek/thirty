import { topicFormSchemaImgUrl } from '@/app/lib/schemas/topicFormSchema';
import { publicProcedure, router } from '../trpc';
import { prisma } from '../prisma';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const session = getServerSession(authOptions);
const userEmail = session?.user?.email;

export const topicRouter = router({
  addTopic: publicProcedure
    .input(topicFormSchemaImgUrl)
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: {
          email: userEmail,
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const topic = await prisma.topic.create({
        data: {
          content: input.content,
          title: input.title,
          image: input.imageURL,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      return topic;
    }),
});

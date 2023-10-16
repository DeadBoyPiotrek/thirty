import { postFormSchemaImgUrl } from '@/lib/schemas/postFormSchema';
import { protectedProcedure, router } from '../trpc';
import {} from 'zod';
import { prisma } from '../prisma';
export const postRouter = router({
  addPost: protectedProcedure
    .input(postFormSchemaImgUrl)
    .mutation(async ({ ctx, input }) => {
      const post = await prisma.post.create({
        data: {
          title: input.title,
          content: input.content,
          image: input.imageURL,

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
});

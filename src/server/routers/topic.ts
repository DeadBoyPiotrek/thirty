import { topicFormSchemaImgUrl } from '@/app/lib/schemas/topicFormSchema';
import { protectedProcedure, router } from '../trpc';
import { prisma } from '../prisma';

export const topicRouter = router({
  addTopic: protectedProcedure
    .input(topicFormSchemaImgUrl)
    .mutation(async ({ ctx, input }) => {
      console.log(`🚀 ~ .mutation ~ input:`, input);
      console.log(`🚀 ~ .mutation ~ ctx:`, ctx);
      // create topic
    }),
});

import { topicFormSchema } from '@/app/lib/schemas/topicFormSchema';
import { publicProcedure, router } from '../trpc';
export const topicRouter = router({
  addTopic: publicProcedure.input(topicFormSchema).mutation(({ input }) => {
    //TODO save image
    //TODO retrieve image url
    //TODO save topic with image url and user id

    console.log(`🚀 ~ .mutation ~ input:`, input);
  }),
});

import { router } from './trpc';

import { userRouter } from './routers/user';
import { postRouter } from './routers/post';
import { topicRouter } from './routers/topic';

export const appRouter = router({
  user: userRouter,
  post: postRouter,
  topic: topicRouter,
});

export type AppRouter = typeof appRouter;

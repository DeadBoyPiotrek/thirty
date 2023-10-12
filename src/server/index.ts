import { router } from './trpc';

import { userRouter } from './routers/user';
import { postRouter } from './routers/post';
import { questRouter } from './routers/quest';

export const appRouter = router({
  user: userRouter,
  post: postRouter,
  quest: questRouter,
});

export type AppRouter = typeof appRouter;

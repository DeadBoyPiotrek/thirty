import { router } from './trpc';

import { userRouter } from './routers/user';
import { postRouter } from './routers/post';
import { questRouter } from './routers/quest';
import { friendsRouter } from './routers/friends';

export const appRouter = router({
  user: userRouter,
  post: postRouter,
  quest: questRouter,
  friends: friendsRouter,
});

export type AppRouter = typeof appRouter;

import { publicProcedure, router } from './trpc';

import { userRouter } from './routers/user';
import { postRouter } from './routers/post';

export const appRouter = router({
  user: userRouter,
  post: postRouter,
  hello: publicProcedure.query(async () => {
    return `Hello from server !`;
  }),
});

export type AppRouter = typeof appRouter;

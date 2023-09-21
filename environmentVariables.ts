import { z } from 'zod';

const envVariables = z.object({
  DATABASE_URL: z.string(),
  NEXTAUTH_UR: z.string(),
  NEXTAUTH_SECRET: z.string(),
  GITHUB_ID: z.string(),
  GITHUB_SECRET: z.string(),
});

envVariables.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}

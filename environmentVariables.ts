import { z } from 'zod';

const envVariables = z.object({
  DATABASE_URL: z.string(),
  NEXTAUTH_URL: z.string(),
  NEXTAUTH_SECRET: z.string(),
  GITHUB_ID: z.string(),
  GITHUB_SECRET: z.string(),
  GOOGLE_ID: z.string(),
  GOOGLE_SECRET: z.string(),
  UPLOADTHING_SECRET: z.string(),
  UPLOADTHING_APP_ID: z.string(),
});

envVariables.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}

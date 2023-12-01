import { z } from 'zod';

const title = z
  .string()
  .trim()
  .min(1, {
    message: 'Title is too short',
  })
  .max(200, { message: 'Title is too long' })
  .nonempty();

const content = z
  .string()
  .trim()
  .min(1, {
    message: 'Content is too short',
  })
  .max(1500, { message: 'Content is too long' })
  .nonempty();

export const image = z
  .custom<FileList>()
  .superRefine((files, ctx) => {
    if (files.length === 0) {
      return true;
    } else {
      if (
        ![
          'image/webp',
          'image/png',
          'image/svg',
          'image/jpg',
          'image/jpeg',
        ].includes(files[0].type)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'File must be a valid image type',
        });
        return false;
      }

      if (files[0].size > 1024 * 1024 * 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'File must be less than 5MB',
        });
        return false;
      }
    }
  })
  .refine(files => files.length === 1 || files.length === 0);

export const imageUrl = z.string().url().optional();

export const questFormSchemaImg = z.object({
  title,
  content,
  image,
});

export const questFormSchemaImgUrl = z.object({
  title,
  content,
  imageUrl,
});

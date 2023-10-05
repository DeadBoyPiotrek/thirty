import { z } from 'zod';

const title = z.string().nonempty().max(250, { message: 'Title is too long' });

const content = z
  .string()
  .nonempty()
  .max(1000, { message: 'Content is too long' });

const image = z
  .custom<FileList>()
  .superRefine((files, ctx) => {
    if (files.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'File must be provided',
      });
      return false;
    }

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

    return true;
  })
  .refine(files => files.length === 1);

const imageURL = z.string().url();

export const topicFormSchemaImg = z.object({
  title,
  content,
  image,
});

export const topicFormSchemaImgUrl = z.object({
  title,
  content,
  imageURL,
});

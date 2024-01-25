import { z } from 'zod';

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

export const imageName = z.string().nonempty().max(500).optional();
export const imageUrl = z.string().nonempty().max(500).url().optional();
export const commentSchema = z.object({
  content: z
    .string()
    .nonempty()
    .trim()
    .min(1, 'Required')
    .max(1000, 'Must be less than 1000'),
});

import { z } from 'zod';
import { image } from './questFormSchema';
const title = z.string().nonempty().max(500);

const content = z
  .string()
  .nonempty()
  .max(1500, { message: 'Content is too long' });

const questId = z.string().cuid();

export const postFormSchemaImg = z.object({
  questId,
  title,
  content,
  image,
});
export const postFormSchemaImgEdit = z.object({
  questId: questId.optional(),
  title: title.optional(),
  content: content.optional(),
  image,
});

export const postFormSchemaImgName = z.object({
  questId,
  title,
  content,
  imageName: z.string().nonempty().max(500).optional(),
  imageUrl: z.string().nonempty().max(500).url().optional(),
});
export const postFormSchemaImgNameEdit = z.object({
  id: z.string().cuid(),
  questId: questId.optional(),
  title: title.optional(),
  content: content.optional(),
  imageName: z.string().nonempty().max(500).optional(),
  imageUrl: z.string().nonempty().max(500).url().optional(),
});

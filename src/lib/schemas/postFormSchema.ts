import { z } from 'zod';
import { image, imageName, imageUrl } from './schemas';
const title = z
  .string()
  .trim()
  .min(1, {
    message: 'Title is too short',
  })
  .max(100, { message: 'Title is too long' });

const content = z
  .string()
  .trim()
  .min(1, {
    message: 'Content is too short',
  })
  .max(1500, { message: 'Content is too long' });

const questId = z.number().int();

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
  imageName,
  imageUrl,
});
export const postFormSchemaImgNameEdit = z.object({
  id: z.number().int(),
  questId: questId.optional(),
  title: title.optional(),
  content: content.optional(),
  imageName,
  imageUrl,
});

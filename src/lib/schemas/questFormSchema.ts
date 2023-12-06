import { z } from 'zod';
import { image } from './schemas';
import { imageName, imageUrl } from './schemas';
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

export const questFormSchemaImg = z.object({
  title,
  content,
  image,
});

export const questFormSchemaImgName = z.object({
  title,
  content,
  imageName,
  imageUrl,
});
export const questFormSchemaImgEdit = z.object({
  title: title.optional(),
  content: content.optional(),
  image,
});
export const questFormSchemaImgNameEdit = z.object({
  id: z.number().int(),
  title: title.optional(),
  content: content.optional(),
  imageName,
  imageUrl,
});

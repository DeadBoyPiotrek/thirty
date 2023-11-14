import { z } from 'zod';
import { image } from './questFormSchema';
const title = z.string().min(1).max(100);

const content = z.string().min(1).max(1500, { message: 'Content is too long' });

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
  imageName: z.string().nonempty().max(500).optional(),
  imageUrl: z.string().nonempty().max(500).url().optional(),
});
export const postFormSchemaImgNameEdit = z.object({
  id: z.number().int(),
  questId: questId.optional(),
  title: title.optional(),
  content: content.optional(),
  imageName: z.string().nonempty().max(500).optional(),
  imageUrl: z.string().nonempty().max(500).url().optional(),
});

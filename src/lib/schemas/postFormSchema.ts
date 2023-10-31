import { z } from 'zod';
import { image, imageURL } from './questFormSchema';
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

export const postFormSchemaImgUrl = z.object({
  questId,
  title,
  content,
  imageURL,
});

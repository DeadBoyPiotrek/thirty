import { z } from 'zod';
import { image, imageUrl, imageName } from './schemas';

const name = z
  .string()
  .trim()
  .min(1, { message: 'Name is too short' })
  .max(20, { message: 'Name is too long' });
const bio = z.string().trim().max(500, { message: 'Bio is too long' });
const profilePrivate = z.boolean().optional();
export const userProfileSchemaImg = z.object({
  name,
  bio,
  image,
  profilePrivate,
});

export const userProfileSchemaImgUrl = z.object({
  name,
  bio,
  imageUrl,
  imageName,
  profilePrivate,
});

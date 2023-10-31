import { z } from 'zod';
import { image, imageURL } from './questFormSchema';

const name = z.string().nonempty().max(50);
const bio = z.string().max(500);
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
  imageURL,
  profilePrivate,
});

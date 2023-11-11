'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { postFormSchemaImgEdit } from '@/lib/schemas/postFormSchema';
import { trpc } from '@/app/_trpc/client';
import { FormError } from '@ui/formError';
import { zodResolver } from '@hookform/resolvers/zod';
import { uploadImage } from '@/lib/helpers/images/uploadImage';
import { Button } from '../ui/button';
type Inputs = Zod.infer<typeof postFormSchemaImgEdit>;

interface PostEditFormProps {
  post: {
    id: number;
    title: string;
    content: string;
    imageUrl: string | null;
  };
  closeModal: () => void;
}

export const PostEditForm = ({ post, closeModal }: PostEditFormProps) => {
  const mutation = trpc.post.updatePost.useMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(postFormSchemaImgEdit),
    defaultValues: { title: post.title, content: post.content },
  });

  const onSubmit: SubmitHandler<Inputs> = async data => {
    if (data.image.length === 0) {
      mutation.mutate({
        id: post.id,
        questId: data.questId,
        content: data.content,
        title: data.title,
      });
    } else {
      const { imageName, imageUrl, error } = await uploadImage({
        image: data.image[0],
        folderName: 'posts',
      });
      if (error) {
        console.log(error);
      }

      mutation.mutate({
        id: post.id,
        content: data.content,
        title: data.title,
        imageName,
        imageUrl,
        questId: data.questId,
      });
    }
    closeModal();
  };

  return (
    <form
      className="text-black flex flex-col gap-2 bg-brandWhite-pure w-96 rounded-lg p-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <label>Post title</label>
      <input {...register('title')} />
      <FormError error={errors.title?.message} />

      <label>Post content</label>
      <textarea {...register('content')} />
      <FormError error={errors.content?.message} />

      <label>Image</label>
      <input {...register('image')} type="file" />
      <FormError error={errors.image?.message} />

      <span className="flex gap-2">
        <Button type="submit" variant={'brand'}>
          Save
        </Button>
        <Button type="reset" variant={'dark'} onClick={() => closeModal()}>
          Cancel
        </Button>
      </span>
    </form>
  );
};

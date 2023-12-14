'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { postFormSchemaImgEdit } from '@/lib/schemas/postFormSchema';
import { trpc } from '@/app/_trpc/client';
import { FormError } from '@ui/formError';
import { zodResolver } from '@hookform/resolvers/zod';
import { uploadImage } from '@/lib/helpers/images/uploadImage';
import { Button } from '@ui/button';
import { Input } from '@ui/input';
import { Textarea } from '@ui/textarea';
import { ImageInput } from '../ui/imageInput';
type Inputs = Zod.infer<typeof postFormSchemaImgEdit>;

interface PostEditFormProps {
  post: {
    id: number;
    title: string;
    content: string;
    imageName: string | null;
    imageUrl: string | null;
  };
  closeModal: () => void;
}

export const PostEditForm = ({ post, closeModal }: PostEditFormProps) => {
  const utils = trpc.useUtils();
  const { mutate: updatePost, isLoading } = trpc.post.updatePost.useMutation({
    onSettled: () => {
      closeModal();

      utils.post.getFeedPosts.invalidate();
      utils.quest.getSingleQuestWithPosts.invalidate();
      utils.post.getUserPageFeedPosts.invalidate();
    },
  });
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
      updatePost({
        id: post.id,
        questId: data.questId,
        content: data.content,
        title: data.title,
      });
    } else {
      const { imageName, imageUrl, error } = await uploadImage({
        image: data.image[0],
        folderName: 'posts',
        oldImageName: post.imageName,
      });
      if (error) {
        console.log(error);
      }

      updatePost({
        id: post.id,
        content: data.content,
        title: data.title,
        imageName,
        imageUrl,
        questId: data.questId,
      });
    }
  };

  return (
    <form
      className="flex flex-col gap-2 w-96 rounded-lg p-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <label>Post title</label>
      <Input {...register('title')} />
      <FormError error={errors.title?.message} />

      <label>Post content</label>
      <Textarea {...register('content')} />
      <FormError error={errors.content?.message} />

      <label htmlFor="image">Image</label>
      <ImageInput id="postEditImage" register={register} />
      <FormError error={errors.image?.message} />

      <span className="flex gap-2 justify-center">
        <Button isLoading={isLoading} type="submit" variant={'brand'}>
          Save
        </Button>
        <Button
          isLoading={isLoading}
          type="reset"
          variant={'dark'}
          onClick={() => closeModal()}
        >
          Cancel
        </Button>
      </span>
    </form>
  );
};

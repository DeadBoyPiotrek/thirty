'use client';

import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { postFormSchemaImg } from '@/lib/schemas/postFormSchema';
import { trpc } from '@/app/_trpc/client';
import { FormError } from '@ui/formError';
import { zodResolver } from '@hookform/resolvers/zod';
import { uploadImage } from '@/lib/helpers/images/uploadImage';
import { Input } from '@ui/input';
import { Textarea } from '@ui/textarea';
import { Button } from '@ui/button';
import { useState } from 'react';

import { QuestSelect } from '../select/questSelect';
import { ImageInput } from '@ui/imageInput';
type Inputs = Zod.infer<typeof postFormSchemaImg>;
interface PostFormProps {
  userQuests: {
    id: number;
    title: string;
  }[];
}

export const PostForm = ({ userQuests }: PostFormProps) => {
  const [questSelectKey, setQuestSelectKey] = useState<number>(0);

  const utils = trpc.useUtils();

  const { mutate: addPost, isLoading } = trpc.post.addPost.useMutation({
    onSettled: () => {
      utils.post.getFeedPosts.invalidate();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<Inputs>({ resolver: zodResolver(postFormSchemaImg) });

  const onSubmit: SubmitHandler<Inputs> = async data => {
    if (data.image.length === 0) {
      addPost({
        questId: data.questId,
        content: data.content,
        title: data.title,
      });
    } else {
      const { imageName, imageUrl, error } = await uploadImage({
        image: data.image[0],
        folderName: 'posts',
        oldImageName: null,
      });
      if (error) {
        console.log(error);
      }

      addPost({
        content: data.content,
        title: data.title,
        imageName,
        imageUrl,
        questId: data.questId,
      });
    }
    reset();

    setQuestSelectKey(prevKey => prevKey + 1);
  };

  return (
    <form
      className="flex flex-col p-5 m-5 bg-brandBlack-medium rounded-lg gap-2 w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex gap-4 ">
        <div className="flex flex-col gap-2 ">
          <label>Quest</label>
          <Controller
            name="questId"
            control={control}
            render={({ field }) => {
              return (
                <QuestSelect
                  field={field}
                  quests={userQuests}
                  key={questSelectKey}
                />
              );
            }}
          ></Controller>
          <FormError error={errors.questId?.message} />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="image" className="text-brandWhite-pure">
            Image
          </label>
          <ImageInput key={questSelectKey} id="postImage" register={register} />
          <FormError error={errors.image?.message} />
        </div>
        <div className="flex flex-col gap-2">
          <label>Post title</label>
          <Input
            variant={'dark'}
            textSize={'lg'}
            className="h-11 "
            {...register('title', { required: true })}
          />
          <FormError error={errors.title?.message} />
        </div>
      </div>
      <label>Post content</label>
      <Textarea variant={'dark'} {...register('content', { required: true })} />

      <FormError error={errors.content?.message} />
      <div className="flex justify-center ">
        <Button
          isLoading={isLoading}
          variant={'brand'}
          className="font-bold px-4"
          type="submit"
        >
          Post
        </Button>
      </div>
    </form>
  );
};

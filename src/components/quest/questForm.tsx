'use client';
import { questFormSchemaImg } from '@/lib/schemas/questFormSchema';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '@_trpc/client';
import { Button } from '@/components/ui/button';
import { FormError } from '../ui/formError';
import { Input } from '@ui/input';
import { Textarea } from '@ui/textarea';
import { useState } from 'react';
import { uploadImage } from '@/lib/helpers/images/uploadImage';
import { ImageInput } from '../ui/imageInput';
export const QuestForm = () => {
  const [imageSelectKey, setImageSelectKey] = useState<number>(0);

  const utils = trpc.useUtils();
  const { mutate: addQuest, isLoading } = trpc.quest.addQuest.useMutation({
    onSettled: () => {
      utils.quest.getQuests.invalidate();
    },
  });

  type Inputs = Zod.infer<typeof questFormSchemaImg>;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>({
    resolver: zodResolver(questFormSchemaImg),
  });
  const onSubmit: SubmitHandler<Inputs> = async data => {
    if (data.image.length === 0) {
      addQuest({
        content: data.content,
        title: data.title,
      });
    } else {
      const { error, imageUrl, imageName } = await uploadImage({
        folderName: 'quests',
        image: data.image[0],
        oldImageName: null,
      });
      if (error) {
        console.log(error);
      }
      addQuest({
        content: data.content,
        title: data.title,
        imageUrl,
        imageName,
      });
    }
    reset();
    setImageSelectKey(prevKey => prevKey + 1);
  };

  return (
    <>
      <form
        className="flex flex-col p-3 sm:p-5 bg-brandBlack-medium rounded-lg gap-2 w-full max-w-xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label htmlFor="title">Title</label>
        <Input variant={'dark'} id="title" {...register('title')} />
        <FormError error={errors.title?.message} />
        <label htmlFor="content">Content</label>
        <Textarea id="content" variant={'dark'} {...register('content')} />
        <FormError error={errors.content?.message} />
        <label htmlFor="image">Image</label>
        <ImageInput key={imageSelectKey} id="questImage" register={register} />

        <FormError error={errors.image?.message} />

        <Button
          isLoading={isLoading}
          variant={'brand'}
          className="self-center px-4 font-bold"
        >
          Add Goal
        </Button>
      </form>
    </>
  );
};

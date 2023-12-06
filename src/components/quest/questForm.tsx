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
export const QuestForm = () => {
  const [imgName, setImgName] = useState<string | null>(null);
  const utils = trpc.useUtils();
  const mutation = trpc.quest.addQuest.useMutation({
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
      mutation.mutate({
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
      mutation.mutate({
        content: data.content,
        title: data.title,
        imageUrl,
        imageName,
      });
    }
    reset();
    setImgName(null);
  };

  return (
    <>
      <form
        className="flex flex-col p-5 m-5 bg-brandBlack-medium rounded-lg gap-2 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label>Quest title</label>
        <Input {...register('title')} />
        <FormError error={errors.title?.message} />
        <label>Quest content</label>
        <Textarea {...register('content')} />
        <FormError error={errors.content?.message} />
        <label htmlFor="image">Image</label>
        <input
          id="image"
          {...register('image', { required: false })}
          type="file"
          className="w-0 h-0 overflow-hidden absolute"
          aria-label="image"
          onChange={e =>
            e.target.files && setImgName(e.target.files[0]?.name || null)
          }
        />
        <label
          htmlFor="image"
          className="text-brandWhite-pure bg-brandBlack-medium border border-brandGray p-2 rounded-lg h-11 cursor-pointer overflow-hidden w-full"
        >
          {imgName ? imgName : 'Choose Image...'}
        </label>
        <FormError error={errors.image?.message} />

        <Button variant={'brand'} className="self-center px-4 font-bold">
          Add Quest
        </Button>
      </form>
    </>
  );
};

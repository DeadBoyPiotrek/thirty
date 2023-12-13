'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { questFormSchemaImgEdit } from '@/lib/schemas/questFormSchema';
import { trpc } from '@/app/_trpc/client';
import { FormError } from '@ui/formError';
import { zodResolver } from '@hookform/resolvers/zod';
import { uploadImage } from '@/lib/helpers/images/uploadImage';
import { Button } from '@ui/button';
import { ImageInput } from '@ui/imageInput';
import { Input } from '@ui/input';
import { Textarea } from '@ui/textarea';
type Inputs = Zod.infer<typeof questFormSchemaImgEdit>;

interface PostEditFormProps {
  quest: {
    id: number;
    title: string;
    content: string;
    imageName: string | null;
    imageUrl: string | null;
  };
  closeModal: () => void;
}

export const QuestEditForm = ({ quest, closeModal }: PostEditFormProps) => {
  const utils = trpc.useUtils();
  const mutation = trpc.quest.updateQuest.useMutation({
    onSettled: () => {
      utils.quest.getSingleQuestWithPosts.invalidate();
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(questFormSchemaImgEdit),
    defaultValues: { title: quest.title, content: quest.content },
  });

  const onSubmit: SubmitHandler<Inputs> = async data => {
    if (data.image.length === 0) {
      mutation.mutate({
        id: quest.id,
        content: data.content,
        title: data.title,
      });
    } else {
      const { imageName, imageUrl, error } = await uploadImage({
        image: data.image[0],
        folderName: 'quests',
        oldImageName: quest.imageName,
      });
      if (error) {
        console.log(error);
      }

      mutation.mutate({
        id: quest.id,
        content: data.content,
        title: data.title,
        imageName,
        imageUrl,
      });
    }
    closeModal();
  };

  return (
    <form
      className=" flex flex-col gap-2 w-96 rounded-lg p-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <label>Quest title</label>
      <Input variant={'dark'} {...register('title')} />
      <FormError error={errors.title?.message} />

      <label>Quest content</label>
      <Textarea variant={'dark'} {...register('content')} />
      <FormError error={errors.content?.message} />

      <label>Image</label>
      <ImageInput id="questEditImage" register={register} />
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

'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { postFormSchemaImg } from '@/lib/schemas/postFormSchema';
import { trpc } from '@/app/_trpc/client';
import { FormError } from '@ui/formError';
import { zodResolver } from '@hookform/resolvers/zod';
import { uploadImage } from '@/lib/helpers/images/uploadImage';
import { Input } from '@ui/input';
import { Textarea } from '@ui/textarea';
import { Button } from '@ui/button';
import { useState } from 'react';

type Inputs = Zod.infer<typeof postFormSchemaImg>;
export const PostForm = () => {
  const [imgName, setImgName] = useState<string | null>(null);

  const allQuests = trpc.quest.getQuestsForPostForm.useQuery();

  const mutation = trpc.post.addPost.useMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>({ resolver: zodResolver(postFormSchemaImg) });

  const onSubmit: SubmitHandler<Inputs> = async data => {
    if (data.image.length === 0) {
      mutation.mutate({
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
        content: data.content,
        title: data.title,
        imageName,
        imageUrl,
        questId: data.questId,
      });
    }
    reset();
  };

  return (
    <form
      className="flex flex-col p-5 m-5 bg-brandBlack-medium rounded-lg gap-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex gap-2 ">
        <div className="flex flex-col gap-2">
          <label>Quest</label>
          <select
            className="text-brandWhite-pure bg-brandBlack-medium border border-brandGray p-2 rounded-lg w-min h-11"
            {...register('questId', { required: true })}
          >
            {allQuests.data?.map(quest => (
              <option key={quest.id} value={quest.id}>
                {quest.title}
              </option>
            ))}
          </select>
        </div>

        <FormError error={errors.questId?.message} />
        <div className="flex flex-col gap-2">
          <label htmlFor="image" className="">
            Image
          </label>
          <input
            id="image"
            {...register('image', { required: false })}
            type="file"
            className="hidden"
            onChange={e =>
              e.target.files && setImgName(e.target.files[0]?.name || null)
            }
          />
          <label
            htmlFor="image"
            className="text-brandWhite-pure bg-brandBlack-medium border border-brandGray p-2 rounded-lg h-11 cursor-pointer overflow-hidden"
          >
            {imgName ? imgName : 'Choose Image'}
          </label>
          <FormError error={errors.image?.message} />
        </div>
        <div className="flex flex-col gap-2">
          <label>Post title</label>
          <Input
            variant={'dark'}
            textSize={'lg'}
            {...register('title', { required: true })}
            className="h-11 "
          />
          <FormError error={errors.title?.message} />
        </div>
      </div>
      <label>Post content</label>
      <Textarea {...register('content', { required: true })} />

      <FormError error={errors.content?.message} />
      <div className="flex justify-center">
        <Button variant={'brand'} className="font-bold" type="submit">
          Post
        </Button>
      </div>
    </form>
  );
};

'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { postFormSchemaImg } from '@/lib/schemas/postFormSchema';
import { trpc } from '@/app/_trpc/client';
import { FormError } from '@ui/formError';
import { zodResolver } from '@hookform/resolvers/zod';
import { uploadImage } from '@/lib/helpers/images/uploadImage';

type Inputs = Zod.infer<typeof postFormSchemaImg>;
export const PostForm = () => {
  const allQuests = trpc.quest.getQuestsForPostForm.useQuery();

  const mutation = trpc.post.addPost.useMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
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
  };

  return (
    <form
      className="flex flex-col w-56 text-yellow-500 border p-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <label>Topic</label>
      <select {...register('questId', { required: true })}>
        {allQuests.data?.map(quest => (
          <option key={quest.id} value={quest.id}>
            {quest.title}
          </option>
        ))}
      </select>
      <FormError error={errors.questId?.message} />

      <label>Post title</label>
      <input {...register('title', { required: true })} />
      <FormError error={errors.title?.message} />

      <label>Post content</label>
      <input {...register('content', { required: true })} />
      {errors.content && <span>This field is required</span>}
      <FormError error={errors.content?.message} />

      <label>Image</label>
      <input {...register('image', { required: false })} type="file" />
      <p> {errors.image && null}</p>
      <FormError error={errors.image?.message} />

      <button type="submit">Submit</button>
    </form>
  );
};

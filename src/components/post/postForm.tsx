'use client';

import { useForm, SubmitHandler } from 'react-hook-form';

import { supabase } from '@/server/supabase';
import { postFormSchemaImg } from '@/lib/schemas/postFormSchema';
import { randomizeName } from '@/lib/utils';
import { trpc } from '@/app/_trpc/client';

type Inputs = Zod.infer<typeof postFormSchemaImg>;
export const PostForm = () => {
  const allQuests = trpc.quest.getQuestsForPostForm.useQuery();

  const mutation = trpc.post.addPost.useMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async data => {
    console.log(`🚀 ~ PostForm ~ data:`, data);
    const { data: resData, error } = await supabase.storage
      .from('posts')
      .upload(randomizeName(data.image[0].name), data.image[0]);
    if (error) {
      console.log(error);
    } else {
      const { data: ResData2 } = supabase.storage
        .from('posts')
        .getPublicUrl(resData?.path);
      mutation.mutate({
        content: data.content,
        title: data.title,
        imageURL: ResData2.publicUrl,
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
      {errors.questId && <span>This field is required</span>}

      <label>Post title</label>
      <input {...register('title', { required: true })} />
      {errors.title && <span>This field is required</span>}

      <label>Post content</label>
      <input {...register('content', { required: true })} />
      {errors.content && <span>This field is required</span>}

      <label>Image</label>
      <input {...register('image', { required: false })} type="file" />
      {errors.image && <span>This field is required</span>}

      <button type="submit">Submit</button>
    </form>
  );
};

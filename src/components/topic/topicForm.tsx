'use client';
import { topicFormSchemaImg } from '@/app/lib/schemas/topicFormSchema';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/server/supabase';
import { trpc } from '@_trpc/client';
export const TopicForm = () => {
  const mutation = trpc.topic.addTopic.useMutation();
  //* form stuff
  type Inputs = Zod.infer<typeof topicFormSchemaImg>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(topicFormSchemaImg),
  });
  const onSubmit: SubmitHandler<Inputs> = async data => {
    const { data: resData, error } = await supabase.storage
      .from('topics')
      .upload(
        data.image[0].name +
          Math.floor(new Date().getTime() / 1000) +
          Math.floor(Math.random() * 1000),
        data.image[0]
      );

    if (error) {
      console.log(error);
    } else {
      const { data: ResData2 } = supabase.storage
        .from('topics')
        .getPublicUrl(resData?.path);
      mutation.mutate({
        content: data.content,
        title: data.title,
        imageURL: ResData2.publicUrl,
      });
      console.log(ResData2.publicUrl);
    }
  };
  //* form stuff

  return (
    <>
      <form
        className="flex flex-col w-56 text-yellow-500 border p-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label>Topic title</label>
        <input {...register('title')} />
        {errors.title?.message && (
          <p className="text-sm text-red-400">{errors.title.message}</p>
        )}
        <label>Topic content</label>
        <input {...register('content')} />
        {errors.content?.message && (
          <p className="text-sm text-red-400">{errors.content.message}</p>
        )}
        <label>Image</label>
        <input {...register('image')} type="file" />
        {errors.image?.message && (
          <p className="text-sm text-red-400">{errors.image.message}</p>
        )}

        <button type="submit">Submit</button>
      </form>
    </>
  );
};

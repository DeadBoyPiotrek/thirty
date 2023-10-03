'use client';
import { topicFormSchema } from '@/app/lib/schemas/topicFormSchema';
import { useForm, SubmitHandler } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '@/app/_trpc/client';

export const TopicForm = () => {
  type Inputs = Zod.infer<typeof topicFormSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(topicFormSchema),
  });
  const mutation = trpc.topic.addTopic.useMutation();
  const onSubmit: SubmitHandler<Inputs> = async data => {
    console.log(`🚀 ~ TopicForm ~ data:`, data);
    mutation.mutate(data);
  };

  return (
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
  );
};

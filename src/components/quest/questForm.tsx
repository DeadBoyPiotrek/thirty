'use client';
import { questFormSchemaImg } from '@/lib/schemas/questFormSchema';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/server/supabase';
import { trpc } from '@_trpc/client';
import { Button } from '@/components/ui/button';
import { randomizeName } from '@/lib/utils';
export const QuestForm = () => {
  const mutation = trpc.quest.addQuest.useMutation();

  type Inputs = Zod.infer<typeof questFormSchemaImg>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(questFormSchemaImg),
  });
  const onSubmit: SubmitHandler<Inputs> = async data => {
    const { data: resData, error } = await supabase.storage
      .from('quests')
      .upload(randomizeName(data.image[0].name), data.image[0]);
    if (error) {
      console.log(error);
    } else {
      const { data: ResData2 } = supabase.storage
        .from('quests')
        .getPublicUrl(resData?.path);
      mutation.mutate({
        content: data.content,
        title: data.title,
        imageURL: ResData2.publicUrl,
      });
    }
  };

  return (
    <>
      <form
        className="flex flex-col w-56 text-yellow-500 border p-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label>quest title</label>
        <input {...register('title')} />
        {errors.title?.message && (
          <p className="text-sm text-red-400">{errors.title.message}</p>
        )}
        <label>quest content</label>
        <input {...register('content')} />
        {errors.content?.message && (
          <p className="text-sm text-red-400">{errors.content.message}</p>
        )}
        <label>Image</label>
        <input {...register('image')} type="file" />
        {errors.image?.message && (
          <p className="text-sm text-red-400">{errors.image.message}</p>
        )}

        <Button className="bg-slate-200 p-2">Submit</Button>
      </form>
    </>
  );
};

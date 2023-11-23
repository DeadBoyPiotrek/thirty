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
import * as Select from '@radix-ui/react-select';
type Inputs = Zod.infer<typeof postFormSchemaImg>;
import { DevTool } from '@hookform/devtools';
interface PostFormProps {
  userQuests: {
    id: number;
    title: string;
  }[];
}

export const PostForm = ({ userQuests }: PostFormProps) => {
  const utils = trpc.useUtils();
  const [imgName, setImgName] = useState<string | null>(null);

  const mutation = trpc.post.addPost.useMutation({
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
    setImgName(null);
  };

  return (
    <form
      className="flex flex-col p-5 m-5 bg-brandBlack-medium rounded-lg gap-2 w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex gap-4 ">
        <div className="flex flex-col gap-2">
          <label>Quest</label>
          {/* <select
            className="text-brandWhite-pure bg-brandBlack-medium border border-brandGray p-2 rounded-lg max-w-sm h-11 "
            {...register('questId', { required: true, valueAsNumber: true })}
          >
            {userQuests.map(quest => {
              return (
                <option key={quest.id} value={quest.id}>
                  {quest.title}
                </option>
              );
            })}
          </select> */}
          <Controller
            name="questId"
            control={control}
            render={({ field }) => (
              <Select.Root
                onValueChange={value => field.onChange(parseInt(value))}
                // {...field}
              >
                <Select.Trigger
                  className="text-brandWhite-pure bg-brandBlack-medium border border-brandGray p-2 rounded-lg max-w-sm h-11 "
                  aria-label="quests"
                >
                  <Select.Value
                    className=" bg-red-50 overflow-hidden max-w-sm break-words"
                    placeholder="Select a quest…"
                  />
                  <Select.Icon className="text-violet11">⬇️</Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content
                    position="popper"
                    className=" bg-brandBlack-medium border border-brandGray rounded-lg max-w-sm "
                  >
                    <Select.Group>
                      {userQuests.map(quest => {
                        return (
                          <Select.Item
                            key={quest.id}
                            value={quest.id.toString()}
                            className="max-w-sm h-11 overflow-hidden break-words hover:bg-brandBlack-light cursor-pointer p-2 "
                          >
                            <Select.ItemText>{quest.title}</Select.ItemText>
                          </Select.Item>
                        );
                      })}
                    </Select.Group>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            )}
          ></Controller>
          <FormError error={errors.questId?.message} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="image" className="">
            Image
          </label>
          <input
            id="image"
            {...register('image', { required: false })}
            type="file"
            className="w-0 h-0 overflow-hidden absolute"
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
      <DevTool control={control} />
    </form>
  );
};

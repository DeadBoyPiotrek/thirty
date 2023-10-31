'use client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '@ui/button';
import { Switch } from '@ui/switch';
import { userProfileSchemaImg } from '@lib/schemas/userProfileSchema';
import { trpc } from '@/app/_trpc/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormError } from '../ui/formError';
import { supabase } from '@/server/supabase';
import { randomizeName } from '@/lib/utils';
type UserProfileFormProps = {
  userData: { name: string; bio: string | null };
  closeModal: () => void;
};

type Inputs = Zod.infer<typeof userProfileSchemaImg>;

export const UserProfileForm = ({
  closeModal,
  userData,
}: UserProfileFormProps) => {
  const mutation = trpc.user.updateProfile.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ resolver: zodResolver(userProfileSchemaImg) });

  const onSubmit: SubmitHandler<Inputs> = async data => {
    if (data.image.length === 0) {
      mutation.mutate(data);
      closeModal();
    } else {
      const { data: resData, error } = await supabase.storage
        .from('avatars')
        .upload(randomizeName(data.image[0].name), data.image[0]);
      if (error) {
        console.log(error);
      } else {
        const { data: ResData2 } = supabase.storage
          .from('avatars')
          .getPublicUrl(resData?.path);
        mutation.mutate({
          bio: data.bio,
          name: data.name,
          imageURL: ResData2.publicUrl,
        });
      }
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="text-black flex flex-col gap-2 bg-brandWhite-pure w-96 rounded-lg p-5"
      >
        <label>Image</label>
        <input {...register('image')} type="file" />
        <FormError error={errors.image?.message} />
        <label>Name</label>
        <input {...register('name')} defaultValue={userData.name} />
        <FormError error={errors.name?.message} />

        <label>Bio</label>
        <textarea
          {...register('bio')}
          defaultValue={userData.bio ?? undefined}
        />
        <FormError error={errors.bio?.message} />

        <Switch />
        <span className="flex gap-2">
          <Button type="submit" variant={'brand'}>
            Save
          </Button>
          <Button type="reset" variant={'dark'} onClick={() => closeModal()}>
            Cancel
          </Button>
        </span>
      </form>
    </>
  );
};

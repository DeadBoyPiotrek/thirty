'use client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '@ui/button';
import { Switch } from '@ui/switch';
import { userProfileSchemaImg } from '@lib/schemas/userProfileSchema';
import { trpc } from '@/app/_trpc/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormError } from '../ui/formError';

import { uploadImage } from '@/lib/helpers/images/uploadImage';
import { Input } from '@ui/input';
import { Textarea } from '@ui/textarea';
type UserProfileFormProps = {
  userData: { name: string; bio: string | null; imageName: string | null };
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
      const { imageName, imageUrl, error } = await uploadImage({
        folderName: 'avatars',
        image: data.image[0],
        oldImageName: userData.imageName,
      });
      mutation.mutate({
        bio: data.bio,
        name: data.name,
        imageUrl,
        imageName,
      });
      closeModal();

      if (error) {
        console.error('uh oh something went wrong', error);
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
        <Input {...register('image')} type="file" variant={'light'} />
        <FormError error={errors.image?.message} />
        <label>Name</label>
        <Input
          {...register('name')}
          defaultValue={userData.name}
          variant={'light'}
        />
        <FormError error={errors.name?.message} />

        <label>Bio</label>
        <Textarea
          {...register('bio')}
          defaultValue={userData.bio ?? undefined}
          variant={'light'}
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

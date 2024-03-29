'use client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '@ui/button';
import { userProfileSchemaImg } from '@lib/schemas/userProfileSchema';
import { trpc } from '@/app/_trpc/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormError } from '@ui/formError';

import { uploadImage } from '@/lib/helpers/images/uploadImage';
import { Input } from '@ui/input';
import { Textarea } from '@ui/textarea';
import { ImageInput } from '@ui/imageInput';
type UserProfileFormProps = {
  userData: { name: string; bio: string | null; imageName: string | null };
  closeModal: () => void;
};

type Inputs = Zod.infer<typeof userProfileSchemaImg>;

export const UserProfileForm = ({
  closeModal,
  userData,
}: UserProfileFormProps) => {
  const utils = trpc.useUtils();
  const { mutate: updateProfile, isLoading } =
    trpc.user.updateProfile.useMutation({
      onSettled: () => {
        utils.user.getUserProfile.invalidate();
        closeModal();
      },
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ resolver: zodResolver(userProfileSchemaImg) });

  const onSubmit: SubmitHandler<Inputs> = async data => {
    if (data.image.length === 0) {
      updateProfile(data);
    } else {
      const { imageName, imageUrl, error } = await uploadImage({
        folderName: 'avatars',
        image: data.image[0],
        oldImageName: userData.imageName,
      });
      updateProfile({
        bio: data.bio,
        name: data.name,
        imageUrl,
        imageName,
      });

      if (error) {
        console.error('uh oh something went wrong', error);
      }
    }
  };

  const { mutate: deleteProfile } = trpc.user.deleteProfile.useMutation();

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2  rounded-lg"
      >
        <label>Image</label>
        <ImageInput
          id="userProfileImg"
          register={register}
          {...register('image')}
        />
        <FormError error={errors.image?.message} />
        <label>Name</label>
        <Input
          {...register('name')}
          defaultValue={userData.name}
          variant={'dark'}
        />
        <FormError error={errors.name?.message} />

        <label>Bio</label>
        <Textarea
          {...register('bio')}
          defaultValue={userData.bio ?? undefined}
          variant={'dark'}
        />
        <FormError error={errors.bio?.message} />

        <span className="flex gap-2 justify-center">
          <Button type="submit" variant={'brand'} isLoading={isLoading}>
            Save
          </Button>
          <Button
            type="reset"
            variant={'dark'}
            onClick={() => closeModal()}
            isLoading={isLoading}
          >
            Cancel
          </Button>
        </span>
      </form>
      <Button
        onClick={() => deleteProfile({ userImageName: userData.imageName })}
        variant={'danger'}
      >
        Delete account
      </Button>
    </>
  );
};

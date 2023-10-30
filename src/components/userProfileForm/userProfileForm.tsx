'use client';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';

const profile = {
  name: 'John Doe',
};

type UserProfileFormProps = {
  closeModal: () => void;
};

export const UserProfileForm = ({ closeModal }: UserProfileFormProps) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = data => {
    console.log(data);
    closeModal();
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="text-black flex flex-col bg-brandWhite-pure w-96 h-96 rounded-lg p-5"
      >
        <label>Name</label>
        <input {...register('name')} defaultValue={profile.name} />
        <Switch />
        <Button type="submit" variant={'brand'}>
          Save
        </Button>
        <Button type="reset" variant={'dark'} onClick={() => closeModal()}>
          Cancel
        </Button>
      </form>
    </>
  );
};

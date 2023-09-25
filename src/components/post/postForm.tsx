'use client';

import { useForm } from 'react-hook-form';

export const PostForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: any) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title', { required: true })} />
      {errors.title && <span>This field is required</span>}

      <input {...register('content', { required: true })} />
      {errors.content && <span>This field is required</span>}

      <input type="submit" />
    </form>
  );
};

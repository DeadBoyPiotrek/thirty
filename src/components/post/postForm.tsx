'use client';

import { useForm } from 'react-hook-form';

import { supabase } from '@/server/supabase';
type TopicFormData = {
  title: string;
  content: string;
  image: FileList;
  topic: string;
};

export const PostForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TopicFormData>();
  const onSubmit = async (data: TopicFormData) => {
    const imageFile = data.image[0];
    console.log(`🚀 ~ onSubmit ~ imageFile:`, imageFile);

    if (imageFile) {
      const response = await supabase.storage
        .from('test')
        .upload('noExtension', imageFile);

      if (response.error) {
        console.error('Error uploading image:', response.error);
      } else {
        console.log('Image uploaded successfully:', response.data);
      }
    }
  };

  return (
    <form
      className="flex flex-col w-56 text-yellow-500 border p-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <label>Topic</label>
      <select {...register('topic', { required: true })}>
        <option value="1">Topic 1</option>
        <option value="2">Topic 2</option>
        <option value="3">Topic 3</option>
      </select>

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

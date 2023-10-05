'use client';
import { topicFormSchema } from '@/app/lib/schemas/topicFormSchema';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import type { FileWithPath } from '@uploadthing/react';
import { useDropzone } from '@uploadthing/react/hooks';
import { generateClientDropzoneAccept } from 'uploadthing/client';
import { useUploadThing } from '@/app/lib/uploadthing/hooks';
import { useCallback, useState } from 'react';

export const TopicForm = () => {
  //* form stuff
  type Inputs = Zod.infer<typeof topicFormSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(topicFormSchema),
  });
  const onSubmit: SubmitHandler<Inputs> = async data => {
    console.log(`🚀 ~ TopicForm ~ data:`, data);
    startUpload(files);
  };
  //* form stuff

  //* uploadthing stuff

  const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setFiles(acceptedFiles);
  }, []);

  const { startUpload, permittedFileInfo } = useUploadThing('imageUploader', {
    onClientUploadComplete: () => {
      alert('uploaded successfully!');
    },
    onUploadError: () => {
      alert('error occurred while uploading');
    },
    // onUploadBegin: () => {
    //   alert('upload has begun');
    // },
  });

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  });

  //* uploadthing stuff

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
        <div {...getRootProps()} className="border">
          <input {...getInputProps()} />
          <p>{`${files.length} selected`}</p>
          Drop files here!
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

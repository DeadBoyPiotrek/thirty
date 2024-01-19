import React, { FC, useState } from 'react';

interface ImageInputProps {
  register: any;
  id: string;
}

export const ImageInput: FC<ImageInputProps> = ({ register, id }) => {
  const [imgName, setImgName] = useState<string>('Choose Image...');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setImgName(file ? file.name : 'Choose Image...');
  };

  return (
    <>
      <input
        id={id}
        {...register('image', {
          required: false,
          onChange: handleChange,
        })}
        className="w-1 h-1 opacity-0 absolute peer"
        type="file"
        aria-label="image"
      />
      <label
        htmlFor={id}
        className="text-brandWhite-pure bg-brandBlack-medium border border-brandGray p-2 rounded-lg h-11 cursor-pointer overflow-hidden lg:w-44 peer-focus:outline outline-1"
      >
        {imgName}
      </label>
    </>
  );
};

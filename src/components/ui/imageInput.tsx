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
        className="p-2 rounded-lg h-11 cursor-pointer overflow-hidden outline-1 focus:outline-none text-brandWhite-pure bg-brandBlack-light focus:ring-1 focus:ring-brandPurple-500 hover:ring-1 ring-brandPurple-500 flex items-center peer-focus:ring-1 peer-focus:ring-brandPurple-500
        "
      >
        {imgName}
      </label>
    </>
  );
};

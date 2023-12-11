import React, { ChangeEvent, FC } from 'react';
interface ImageInputProps {
  label: string;
  onChange: (_file: File | null) => void;
  //   TODO: fix any
  register: any;
}

export const ImageInput: FC<ImageInputProps> = ({
  label,
  onChange,
  register,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    onChange(file || null);
  };

  return (
    <>
      <input
        {...register('image', { required: false, onChange: handleChange })}
        id="image"
        type="file"
        className="w-1 h-1 opacity-0 absolute peer"
        aria-label="image"
      />
      <label
        htmlFor="image"
        className="text-brandWhite-pure bg-brandBlack-medium border border-brandGray p-2 rounded-lg h-11 cursor-pointer overflow-hidden w-44 peer-focus:outline outline-1"
      >
        {label}
      </label>
    </>
  );
};

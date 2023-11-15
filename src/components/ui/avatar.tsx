/* eslint-disable */

'use client';
import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';
import Image, { ImageProps } from 'next/image';
import { FC } from 'react';

const avatarVariants = cva('rounded-full overflow-hidden', {
  variants: {
    size: {
      sm: 'w-10 h-10',
      md: 'w-20 h-20',
      lg: 'w-40 h-40',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
interface AvatarProps extends ImageProps, VariantProps<typeof avatarVariants> {}

export const Avatar: FC<AvatarProps> = ({
  className,
  size,
  ...props
}: AvatarProps) => {
  return (
    <Image
      className={cn(avatarVariants({ size }), className)}
      width={100}
      height={100}
      {...props}
    />
  );
};

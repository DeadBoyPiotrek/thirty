'use client';
import { cn } from '@/app/lib/utils';
import * as AvatarPrimitive from '@radix-ui/react-avatar';

type AvatarProps = {
  className?: string;
  imgUrl: string;
};

const Avatar = ({ className, imgUrl }: AvatarProps) => {
  return (
    <AvatarPrimitive.Root className={cn(className, 'bg-red-50')}>
      <AvatarPrimitive.Image src={imgUrl} alt="Avatar" className="w-10" />
      <AvatarPrimitive.Fallback className="text-red-500 ">
        P
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
};

const AvatarFallback = () => {
  return <AvatarPrimitive.Fallback></AvatarPrimitive.Fallback>;
};

export { Avatar, AvatarFallback };

'use client';
import { cn } from '@/lib/utils';
import * as AvatarPrimitive from '@radix-ui/react-avatar';

type AvatarProps = {
  className?: string;
  children: React.ReactNode;
};

const Avatar = ({ className, children }: AvatarProps) => {
  return (
    <AvatarPrimitive.Root className={cn(className)}>
      {children}
    </AvatarPrimitive.Root>
  );
};

type AvatarFallbackProps = {
  userName: string;
};

const AvatarFallback = ({ userName }: AvatarFallbackProps) => {
  return (
    <AvatarPrimitive.Fallback className="text-red-500 ">
      {userName}
    </AvatarPrimitive.Fallback>
  );
};

export { Avatar, AvatarFallback };

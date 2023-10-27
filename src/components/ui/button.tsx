import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';
import { FC } from 'react';

const buttonVariants = cva('p-2', {
  variants: {
    variant: {
      primary: 'bg-red-400',
      secondary: 'bg-blue-400',
    },
    size: {
      sm: 'text-sm',
      md: 'text-md',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});
interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button: FC<ButtonProps> = ({ className, size, variant, ...props }) => {
  return (
    <button
      className={cn(buttonVariants({ size, variant }), className)}
      {...props}
    />
  );
};

export { Button, buttonVariants };

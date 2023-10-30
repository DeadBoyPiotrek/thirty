import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';
import { FC } from 'react';

const buttonVariants = cva('p-2 rounded-lg transition block', {
  variants: {
    variant: {
      brand: 'bg-brandPurple-500 text-brandWhite hover:bg-brandPurple-300 ',
      light: 'bg-brandWhite-pure text-brandBlack-deep hover:bg-brandWhite-100 ',
      dark: 'text-brandWhite-pure bg-brandBlack-medium border border-brandGray hover:bg-brandBlack-light',
      ghost: 'text-brandGray hover:text-brandWhite-pure',
    },
    size: {
      sm: 'text-sm',
      md: 'text-md',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    variant: 'light',
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

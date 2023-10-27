import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';
import { FC } from 'react';

const buttonVariants = cva('p-2 rounded-lg transition ', {
  variants: {
    variant: {
      light: 'bg-brandWhite text-brandBlack hover:bg-brandWhite/90 ',
      dark: 'bg-brandLightBlack border border-brandGray/30 hover:bg-brandWhite/10',
      ghost: 'text-brandGray hover:text-brandWhite',
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

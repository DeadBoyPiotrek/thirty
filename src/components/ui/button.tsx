import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';
import React from 'react';
import { Spinner } from '@ui/spinner';

const buttonVariants = cva('p-2 rounded-md transition', {
  variants: {
    variant: {
      brand: 'bg-brandPurple-500 text-brandWhite-pure hover:bg-brandPurple-300',
      light: 'bg-brandWhite-pure text-brandBlack-deep hover:bg-brandWhite-100',
      dark: 'text-brandWhite-pure bg-brandBlack-medium border border-brandGray hover:bg-brandBlack-light',
      ghost: 'text-brandGray hover:text-brandWhite-pure',
      disabled: 'text-brandGray hover:text-brandGray cursor-auto',
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
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, size, variant, isLoading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ size, variant }), className)}
        {...props}
        disabled={isLoading}
        style={{ position: isLoading ? 'relative' : 'static' }}
      >
        <div
          className={`flex items-center justify-center w-full ${
            isLoading ? 'blur-sm' : ''
          }`}
        >
          {children}
        </div>
        {isLoading && (
          <div className="absolute inset-0 flex justify-center items-center">
            <Spinner />
          </div>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

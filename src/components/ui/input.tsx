import * as React from 'react';
import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';
const inputVariants = cva('p-2 rounded-lg transition block  ', {
  variants: {
    variant: {
      // brand:
      //   'bg-brandPurple-500 text-brandWhite-pure hover:bg-brandPurple-300 ',
      light: 'bg-brandWhite-pure text-brandBlack-deep hover:bg-brandWhite-100 ',
      dark: 'focus:outline-none text-brandWhite-pure bg-brandBlack-light focus:ring-1 focus:ring-brandPurple-500 hover:ring-1 ring-brandPurple-500',
    },
    textSize: {
      sm: 'text-sm',
      md: 'text-md',
      lg: 'text-lg',
    },
  },

  defaultVariants: {
    variant: 'light',
    textSize: 'md',
  },
});

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, textSize, variant, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(inputVariants({ textSize, variant }), className)}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

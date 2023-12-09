import * as React from 'react';
import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';
const inputVariants = cva('p-2 rounded-lg transition block', {
  variants: {
    variant: {
      // brand:
      //   'bg-brandPurple-500 text-brandWhite-pure hover:bg-brandPurple-300 ',
      light: 'bg-brandWhite-pure text-brandBlack-deep hover:bg-brandWhite-100 ',
      dark: 'text-brandWhite-pure bg-brandBlack-medium border border-brandGray hover:bg-brandBlack-light',
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

const Input = React.forwardRef<HTMLInputElement, InputProps>(
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

export { Input };

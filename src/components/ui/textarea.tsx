import React from 'react';
import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';
const textareaVariants = cva('p-2 rounded-lg transition block', {
  variants: {
    variant: {
      // brand:
      //   'bg-brandPurple-500 text-brandWhite-pure hover:bg-brandPurple-300 ',
      light: 'bg-brandWhite-pure text-brandBlack-deep hover:bg-brandWhite-100 ',
      dark: 'focus:outline-none text-brandWhite-pure bg-brandBlack-light focus:ring-1 focus:ring-brandPurple-500 hover:ring-1 ring-brandPurple-500',
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

interface textareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, textareaProps>(
  ({ className, size, variant, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(textareaVariants({ size, variant }), className)}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };

import { cn } from '@/lib/utils';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ className }: ButtonProps) => {
  return <button className={cn(`bg-fuchsia-300`, className)}>Submit</button>;
};

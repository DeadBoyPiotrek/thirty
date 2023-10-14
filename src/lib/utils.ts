import { clsx, ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function randomizeName(imageName: string) {
  return (
    imageName +
    Math.floor(new Date().getTime() / 1000) +
    Math.floor(Math.random() * 1000)
  );
}

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
} 
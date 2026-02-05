import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Simple date formatting helper.
 * Usage: formatDate(post.metadata.date) or formatDate(new Date(), 'en-US')
 */
export function formatDate(
    date: string | number | Date,
    locale = 'en-US',
    options?: Intl.DateTimeFormatOptions
): string {
    const d = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(d.getTime())) return '';
    const fmt: Intl.DateTimeFormatOptions = options ?? {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    return new Intl.DateTimeFormat(locale, fmt).format(d);
}
// Example utility function
export function cn(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
} 
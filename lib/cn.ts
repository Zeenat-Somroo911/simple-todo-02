/**
 * Utility for merging Tailwind CSS class names
 * Uses clsx for conditional classes and tailwind-merge to properly merge Tailwind classes
 * This ensures that later classes override earlier ones (e.g., "bg-red-500 bg-blue-500" -> "bg-blue-500")
 */
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

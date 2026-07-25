import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind class combiner — same helper as the main project. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function sleep(second: number) {
  await new Promise((resolve) => {
    setTimeout(resolve, second * 1000);
  });
}

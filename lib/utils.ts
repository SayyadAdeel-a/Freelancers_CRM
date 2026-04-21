import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Timestamp, FieldValue } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Timestamp | FieldValue | null | undefined): string {
  if (!date) return "Just now";
  if (date && 'toDate' in date && typeof date.toDate === "function") {
    return (date.toDate() as Date).toLocaleDateString();
  }
  return "Just now";
}

export function formatRelativeTime(date: Timestamp | FieldValue | null | undefined): string {
  if (!date) return "Just now";
  if (date && 'toDate' in date && typeof date.toDate === "function") {
    return formatDistanceToNow(date.toDate() as Date, { addSuffix: true });
  }
  return "Just now";
}

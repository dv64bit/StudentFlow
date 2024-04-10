import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getCreatedTimeStamp = (createdAt: Date): string => {
  const now = new Date();
  const diff = Math.abs(now.getTime() - createdAt.getTime());
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return years === 1 ? "1 year ago" : `${years} years ago`;
  } else if (months > 0) {
    return months === 1 ? "1 month ago" : `${months} months ago`;
  } else if (weeks > 0) {
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  } else if (days > 0) {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  } else if (hours > 0) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  } else if (minutes > 0) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  } else {
    return seconds === 1 ? "1 second ago" : `${seconds} seconds ago`;
  }
};

export const formatNumber = (number: number): string => {
  if (Math.abs(number) >= 1.0e9) {
    return (number / 1.0e9).toFixed(1) + "B";
  }
  if (Math.abs(number) >= 1.0e6) {
    return (number / 1.0e6).toFixed(1) + "M";
  }
  if (Math.abs(number) >= 1.0e3) {
    return (number / 1.0e3).toFixed(1) + "K";
  }
  return number.toString();
};

//using Chatgpt:  get the javascript date object as a parameter and return a joined date(just a month and year)

export const getJoinedDate = (date: Date): string => {
  // Extract month and year from the date object
  const month = date.toLocaleString("default", { month: "long" }); // Get full month name
  const year = date.getFullYear(); // Get the year

  // Concatenate month and year
  const joinedDate = `${month} ${year}`;

  return joinedDate;
};

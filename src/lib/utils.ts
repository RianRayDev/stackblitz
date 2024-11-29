import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { User } from './store/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type UserRole = User['role'];

// Function to get the prefix for each role
export function getUserIdPrefix(role: UserRole): string {
  switch (role) {
    case 'customer':
      return 'cu';
    case 'distributing_franchise':
      return 'fr';
    case 'webmaster':
      return 'web';
    default:
      return 'te';
  }
}

// Function to get the next available ID for a role
export function getNextUserId(users: User[], role: UserRole): string {
  const prefix = getUserIdPrefix(role);
  const existingIds = users
    .filter(user => user.username.startsWith(prefix))
    .map(user => {
      const numericPart = user.username.slice(prefix.length);
      return parseInt(numericPart, 10);
    })
    .filter(num => !isNaN(num));

  const maxId = Math.max(0, ...existingIds);
  const nextId = maxId + 1;

  // Format based on role
  if (role === 'webmaster') {
    return `${prefix}${String(nextId).padStart(2, '0')}`;
  }

  return `${prefix}${String(nextId).padStart(6, '0')}`;
}

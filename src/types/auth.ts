export type UserRole = 'webmaster' | 'distributing_franchise';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
}
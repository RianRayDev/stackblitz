export type ActivationStatus = 'pending' | 'active' | 'inactive';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'webmaster' | 'distributing_franchise' | 'customer';
  isActive: boolean;
  activationStatus: ActivationStatus;
  lastActive: string;
  isOnline?: boolean;
  franchiseName?: string | null;
  avatar?: string;
  teammates?: string[];
  followers?: string[];
  following?: string[];
  permissions: {
    canEditProducts: boolean;
    canAddProducts: boolean;
    canDeleteProducts: boolean;
  };
  createdAt?: any;
  updatedAt?: any;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  stock: number;
  tags: string[];
  description: string;
  features?: string[];
  isFeatured?: boolean;
  createdBy: string;
  franchiseId?: string;
  status: 'active' | 'draft' | 'archived';
  createdAt?: any;
  updatedAt?: any;
}

export interface Purchase {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'completed' | 'cancelled';
  purchaseDate: any;
}
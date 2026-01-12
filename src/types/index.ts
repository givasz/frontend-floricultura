export interface Category {
  id: number;
  name: string;
  imageUrl?: string;
  products?: Product[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  order: number;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  active: boolean;
  categoryId: number;
  category?: Category;
  images?: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: number;
  qty: number;
}

export interface CartItemResponse {
  id: number;
  qty: number;
  price: number;
  product: {
    id: number;
    name: string;
    imageUrl: string;
    description: string;
  };
}

export interface Cart {
  id: number;
  uid: string;
  customerName: string;
  phone: string;
  note?: string;
  deliveryMethod: 'delivery' | 'pickup';
  address?: string;
  items: CartItemResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCartPayload {
  customerName: string;
  phone: string;
  note?: string;
  deliveryMethod: 'delivery' | 'pickup';
  address?: string;
  items: CartItem[];
}

export interface CreateCartResponse {
  cartId: number;
  uid: string;
  link: string;
}

// Tipos para paginação
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

// Configurações do site
export interface SiteConfig {
  id: number;
  heroImageUrl: string;
  createdAt: string;
  updatedAt: string;
}

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
  // Produtos podem ter múltiplas categorias (relação many-to-many)
  categories?: ProductCategory[];
  images?: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: number;
  productId: number;
  categoryId: number;
  category: Category;
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
  
  // Campos extras que o backend pode retornar
  link?: string;
  whatsappLink?: string;
  paymentMethod?: 'pix' | 'credit_card' | 'debit_card' | 'cash';
  needsChange?: boolean;
  changeFor?: number;
  recipientName?: string;
  recipientPhone?: string;
  
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

// Tipo usado pelo contexto local do carrinho (produto + quantidade)
export interface CartProductItem {
  product: Product;
  quantity: number;
}

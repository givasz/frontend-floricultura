import { Product, Category, CreateCartPayload, CreateCartResponse, Cart, PaginatedResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const api = {
  getProducts: async (filters: { category?: string; active?: string; page?: number; limit?: number } = {}): Promise<PaginatedResponse<Product>> => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.active) params.append('active', filters.active);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const res = await fetch(`${API_URL}/products?${params}`);
    if (!res.ok) throw new Error('Erro ao buscar produtos');
    return res.json();
  },

  getProduct: async (id: number): Promise<Product> => {
    const res = await fetch(`${API_URL}/products/${id}`);
    if (!res.ok) throw new Error('Erro ao buscar produto');
    return res.json();
  },

  // Categorias
  getCategories: async (filters: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<Category>> => {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const res = await fetch(`${API_URL}/categories?${params}`);
    if (!res.ok) throw new Error('Erro ao buscar categorias');
    return res.json();
  },

  // Carrinho
  createCart: async (cartData: CreateCartPayload): Promise<CreateCartResponse> => {
    const res = await fetch(`${API_URL}/carrinho`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cartData)
    });
    if (!res.ok) throw new Error('Erro ao criar carrinho');
    return res.json();
  },

  getCart: async (uid: string): Promise<Cart> => {
    const res = await fetch(`${API_URL}/carrinho/${uid}`);
    if (!res.ok) throw new Error('Erro ao buscar carrinho');
    return res.json();
  },

  admin: {
    getHeaders: () => {
      const token = localStorage.getItem("adminToken");
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };
    },

    createProduct: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'category'>): Promise<Product> => {
      const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: api.admin.getHeaders(),
        body: JSON.stringify(product)
      });
      if (!res.ok) throw new Error('Erro ao criar produto');
      return res.json();
    },

    updateProduct: async (id: number, product: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'category'>>): Promise<Product> => {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "PUT",
        headers: api.admin.getHeaders(),
        body: JSON.stringify(product)
      });
      if (!res.ok) throw new Error('Erro ao atualizar produto');
      return res.json();
    },

    toggleProduct: async (id: number): Promise<Product> => {
      const res = await fetch(`${API_URL}/products/${id}/toggle`, {
        method: "POST",
        headers: api.admin.getHeaders()
      });
      if (!res.ok) throw new Error('Erro ao alternar status do produto');
      return res.json();
    },

    deleteProduct: async (id: number): Promise<void> => {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: api.admin.getHeaders()
      });
      if (!res.ok) throw new Error('Erro ao deletar produto');
    },

    createCategory: async (category: { name: string; imageUrl?: string }): Promise<Category> => {
      const res = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: api.admin.getHeaders(),
        body: JSON.stringify(category)
      });
      if (!res.ok) throw new Error('Erro ao criar categoria');
      return res.json();
    },

    updateCategory: async (id: number, category: { name: string; imageUrl?: string }): Promise<Category> => {
      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: "PUT",
        headers: api.admin.getHeaders(),
        body: JSON.stringify(category)
      });
      if (!res.ok) throw new Error('Erro ao atualizar categoria');
      return res.json();
    },

    deleteCategory: async (id: number): Promise<void> => {
      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: "DELETE",
        headers: api.admin.getHeaders()
      });
      if (!res.ok) throw new Error('Erro ao deletar categoria');
    },

    getCarts: async (filters: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<Cart>> => {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const res = await fetch(`${API_URL}/admin/carrinhos?${params}`, {
        headers: api.admin.getHeaders()
      });
      if (!res.ok) throw new Error('Erro ao buscar carrinhos');
      return res.json();
    }
  }
};

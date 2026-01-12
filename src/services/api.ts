import { Product, Category, CreateCartPayload, CreateCartResponse, Cart, PaginatedResponse, SiteConfig } from '../types';

// Garantir que a URL sempre tenha protocolo
const getApiUrl = () => {
  const url = import.meta.env.VITE_API_URL || "http://localhost:3000";
  // Se a URL não começar com http:// ou https://, adicionar https://
  if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
};

const API_URL = getApiUrl();

export const api = {
  getProducts: async (filters: { category?: string; active?: string; page?: number; limit?: number } = {}): Promise<PaginatedResponse<Product>> => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.active) params.append('active', filters.active);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const res = await fetch(`${API_URL}/products?${params}`);
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Erro desconhecido' }));
      console.error('Erro ao buscar produtos:', error);
      throw new Error(error.error || 'Erro ao buscar produtos');
    }
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

  finalizeCart: async (uid: string, finalizationData: {
    paymentMethod: 'pix' | 'credit_card' | 'debit_card' | 'cash';
    needsChange?: boolean;
    changeFor?: number;
    recipientName: string;
    recipientPhone: string;
  }): Promise<Cart> => {
    const res = await fetch(`${API_URL}/carrinho/${uid}/finalize`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalizationData)
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Erro ao finalizar carrinho' }));
      console.error('Erro ao finalizar carrinho:', error);
      throw new Error(error.error || 'Erro ao finalizar carrinho');
    }
    return res.json();
  },

  // Configurações do site
  getSiteConfig: async (): Promise<SiteConfig> => {
    const res = await fetch(`${API_URL}/config`);
    if (!res.ok) throw new Error('Erro ao buscar configurações');
    const config = await res.json();
    // Normalizar heroImageUrl: se for um caminho relativo (começa com '/'), prefixar com API_URL
    if (config && config.heroImageUrl && typeof config.heroImageUrl === 'string' && config.heroImageUrl.startsWith('/')) {
      config.heroImageUrl = `${API_URL}${config.heroImageUrl}`;
    }
    return config;
  },

  admin: {
    getHeaders: () => {
      const token = localStorage.getItem("adminToken");
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };
    },

    getAuthHeaders: () => {
      const token = localStorage.getItem("adminToken");
      return {
        "Authorization": `Bearer ${token}`
      };
    },

    // Autenticação admin (login)
    login: async (username: string, password: string) => {
      const adminRoute = import.meta.env.VITE_ADMIN_ROUTE || '/admin';
      const res = await fetch(`${API_URL}${adminRoute}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Erro ao autenticar' }));
        throw new Error(error.error || 'Erro ao autenticar');
      }
      const data = await res.json();
      return data.token;
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

      const adminRoute = import.meta.env.VITE_ADMIN_ROUTE || '/admin';
      const res = await fetch(`${API_URL}${adminRoute}/carrinhos?${params}`, {
        headers: api.admin.getHeaders()
      });
      if (!res.ok) throw new Error('Erro ao buscar carrinhos');
      return res.json();
    },

    updateSiteConfig: async (config: { heroImageUrl: string }): Promise<SiteConfig> => {
      const res = await fetch(`${API_URL}/config`, {
        method: "PUT",
        headers: api.admin.getHeaders(),
        body: JSON.stringify(config)
      });
      if (!res.ok) throw new Error('Erro ao atualizar configurações');
      return res.json();
    },

    // Upload de imagens
    uploadProductImage: async (file: File): Promise<{ imageUrl: string }> => {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`${API_URL}/products/upload-image`, {
        method: "POST",
        headers: api.admin.getAuthHeaders(),
        body: formData
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao enviar imagem');
      }
      return res.json();
    },

    uploadCategoryImage: async (file: File): Promise<{ imageUrl: string }> => {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`${API_URL}/categories/upload-image`, {
        method: "POST",
        headers: api.admin.getAuthHeaders(),
        body: formData
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao enviar imagem');
      }
      return res.json();
    },

    uploadSiteHeroImage: async (file: File): Promise<{ imageUrl: string; config: SiteConfig }> => {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`${API_URL}/config/upload-image`, {
        method: "POST",
        headers: api.admin.getAuthHeaders(),
        body: formData
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Erro ao enviar imagem' }));
        throw new Error(error.error || 'Erro ao enviar imagem');
      }

      const result = await res.json();
      // Normalizar imageUrl e config.heroImageUrl se vierem relativos
      const imageUrl = result.imageUrl && typeof result.imageUrl === 'string' && result.imageUrl.startsWith('/') ? `${API_URL}${result.imageUrl}` : result.imageUrl;
      if (result.config && result.config.heroImageUrl && typeof result.config.heroImageUrl === 'string' && result.config.heroImageUrl.startsWith('/')) {
        result.config.heroImageUrl = `${API_URL}${result.config.heroImageUrl}`;
      }

      return { imageUrl, config: result.config };
    },

    createProductWithImage: async (formData: FormData): Promise<Product> => {
      const res = await fetch(`${API_URL}/products/with-image`, {
        method: "POST",
        headers: api.admin.getAuthHeaders(),
        body: formData
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao criar produto');
      }
      return res.json();
    },

    updateProductWithImage: async (id: number, formData: FormData): Promise<Product> => {
      const res = await fetch(`${API_URL}/products/${id}/with-image`, {
        method: "PUT",
        headers: api.admin.getAuthHeaders(),
        body: formData
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao atualizar produto');
      }
      return res.json();
    },

    createCategoryWithImage: async (formData: FormData): Promise<Category> => {
      const res = await fetch(`${API_URL}/categories/with-image`, {
        method: "POST",
        headers: api.admin.getAuthHeaders(),
        body: formData
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao criar categoria');
      }
      return res.json();
    },

    updateCategoryWithImage: async (id: number, formData: FormData): Promise<Category> => {
      const res = await fetch(`${API_URL}/categories/${id}/with-image`, {
        method: "PUT",
        headers: api.admin.getAuthHeaders(),
        body: formData
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao atualizar categoria');
      }
      return res.json();
    },

    // Múltiplas imagens por produto
    getProductImages: async (productId: number) => {
      const res = await fetch(`${API_URL}/products/${productId}/images`);
      if (!res.ok) throw new Error('Erro ao buscar imagens do produto');
      return res.json();
    },

    addProductImage: async (productId: number, file: File, order?: number) => {
      const formData = new FormData();
      formData.append('image', file);
      if (order !== undefined) {
        formData.append('order', order.toString());
      }

      const res = await fetch(`${API_URL}/products/${productId}/images`, {
        method: "POST",
        headers: api.admin.getAuthHeaders(),
        body: formData
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao adicionar imagem');
      }
      return res.json();
    },

    addMultipleProductImages: async (productId: number, files: File[]) => {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const res = await fetch(`${API_URL}/products/${productId}/images/multiple`, {
        method: "POST",
        headers: api.admin.getAuthHeaders(),
        body: formData
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao adicionar imagens');
      }
      return res.json();
    },

    deleteProductImage: async (productId: number, imageId: number) => {
      const res = await fetch(`${API_URL}/products/${productId}/images/${imageId}`, {
        method: "DELETE",
        headers: api.admin.getAuthHeaders()
      });
      if (!res.ok) throw new Error('Erro ao deletar imagem');
    },

    reorderProductImages: async (productId: number, images: { id: number; order: number }[]) => {
      const res = await fetch(`${API_URL}/products/${productId}/images/reorder`, {
        method: "PUT",
        headers: api.admin.getHeaders(),
        body: JSON.stringify({ images })
      });
      if (!res.ok) throw new Error('Erro ao reordenar imagens');
      return res.json();
    }
  }
};

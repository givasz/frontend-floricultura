import { useState, useEffect } from 'react';
import { LogOut, Package, FolderOpen, ShoppingCart, Edit, Trash2, Plus, ExternalLink, Settings, Images } from 'lucide-react';
import { api } from '../services/api';
import { Product, Category, Cart, Pagination as PaginationType, SiteConfig } from '../types';
import { useToast } from '../hooks/useToast';
import AdminLogin from '../components/admin/AdminLogin';
import ProductForm from '../components/admin/ProductForm';
import CategoryForm from '../components/admin/CategoryForm';
import ProductImagesModal from '../components/admin/ProductImagesModal';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';

export default function PainelAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'carts' | 'config'>('products');
  const { showToast, ToastComponent } = useToast();

  // Estados para produtos
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsPage, setProductsPage] = useState(1);
  const [productsPagination, setProductsPagination] = useState<PaginationType>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Estados para categorias
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categoriesPage, setCategoriesPage] = useState(1);
  const [categoriesPagination, setCategoriesPagination] = useState<PaginationType>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Estados para carrinhos
  const [carts, setCarts] = useState<Cart[]>([]);
  const [loadingCarts, setLoadingCarts] = useState(false);
  const [cartsPage, setCartsPage] = useState(1);
  const [cartsPagination, setCartsPagination] = useState<PaginationType>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Estados para modals
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [showProductImages, setShowProductImages] = useState(false);
  const [managingImagesProduct, setManagingImagesProduct] = useState<Product | undefined>();

  // Estados para configurações
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [uploadingHero, setUploadingHero] = useState(false);

  useEffect(() => {
    const credentials = localStorage.getItem('adminCredentials');
    if (credentials) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadCategories();
      if (activeTab === 'products') {
        loadProducts();
      } else if (activeTab === 'carts') {
        loadCarts();
      } else if (activeTab === 'config') {
        loadConfig();
      }
    }
  }, [isAuthenticated, activeTab, productsPage, categoriesPage, cartsPage]);

  const handleLogin = async (email: string, password: string) => {
    try {
      const { adminRoute } = await api.admin.login(email, password);
      const credentials = btoa(`${email}:${password}`);
      localStorage.setItem('adminCredentials', credentials);
      localStorage.setItem('adminRoute', adminRoute);
      await api.getCategories();
      setIsAuthenticated(true);
      showToast('Login realizado com sucesso!', 'success');
    } catch (error: any) {
      localStorage.removeItem('adminCredentials');
      localStorage.removeItem('adminRoute');
      showToast(error.message || 'Email ou senha incorretos', 'error');
      throw error;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminCredentials');
    localStorage.removeItem('adminRoute');
    setIsAuthenticated(false);
    showToast('Logout realizado com sucesso', 'info');
  };

  // Funções de Produtos
  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const result = await api.getProducts({ page: productsPage, limit: 20 });
      setProducts(result.data);
      setProductsPagination(result.pagination);
    } catch (error) {
      showToast('Erro ao carregar produtos', 'error');
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleCreateProduct = async (data: any) => {
    try {
      await api.admin.createProduct(data);
      showToast('Produto criado com sucesso!', 'success');
      loadProducts();
    } catch (error) {
      showToast('Erro ao criar produto', 'error');
      throw error;
    }
  };

  const handleUpdateProduct = async (data: any) => {
    if (!editingProduct) return;
    try {
      await api.admin.updateProduct(editingProduct.id, data);
      showToast('Produto atualizado com sucesso!', 'success');
      loadProducts();
    } catch (error) {
      showToast('Erro ao atualizar produto', 'error');
      throw error;
    }
  };

  const handleToggleProduct = async (id: number) => {
    try {
      await api.admin.toggleProduct(id);
      showToast('Status do produto alterado!', 'success');
      loadProducts();
    } catch (error) {
      showToast('Erro ao alterar status do produto', 'error');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este produto?')) return;
    try {
      await api.admin.deleteProduct(id);
      showToast('Produto deletado com sucesso!', 'success');
      loadProducts();
    } catch (error) {
      showToast('Erro ao deletar produto', 'error');
    }
  };

  // Funções de Categorias
  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      const result = await api.getCategories({ page: categoriesPage, limit: 20 });
      setCategories(result.data);
      setCategoriesPagination(result.pagination);
    } catch (error) {
      showToast('Erro ao carregar categorias', 'error');
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleCreateCategory = async (data: { name: string }) => {
    try {
      await api.admin.createCategory(data);
      showToast('Categoria criada com sucesso!', 'success');
      loadCategories();
    } catch (error) {
      showToast('Erro ao criar categoria', 'error');
      throw error;
    }
  };

  const handleUpdateCategory = async (data: { name: string }) => {
    if (!editingCategory) return;
    try {
      await api.admin.updateCategory(editingCategory.id, data);
      showToast('Categoria atualizada com sucesso!', 'success');
      loadCategories();
    } catch (error) {
      showToast('Erro ao atualizar categoria', 'error');
      throw error;
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar esta categoria?')) return;
    try {
      await api.admin.deleteCategory(id);
      showToast('Categoria deletada com sucesso!', 'success');
      loadCategories();
    } catch (error) {
      showToast('Erro ao deletar categoria', 'error');
    }
  };

  // Funções de Carrinhos
  const loadCarts = async () => {
    setLoadingCarts(true);
    try {
      const result = await api.admin.getCarts({ page: cartsPage, limit: 20 });
      setCarts(result.data);
      setCartsPagination(result.pagination);
    } catch (error) {
      showToast('Erro ao carregar carrinhos', 'error');
    } finally {
      setLoadingCarts(false);
    }
  };

  const handleProductsPageChange = (page: number) => setProductsPage(page);
  const handleCategoriesPageChange = (page: number) => setCategoriesPage(page);
  const handleCartsPageChange = (page: number) => setCartsPage(page);

  // Funções de Configurações
  const loadConfig = async () => {
    setLoadingConfig(true);
    try {
      const config = await api.getSiteConfig();
      setSiteConfig(config);
      setHeroImageUrl(config.heroImageUrl);
    } catch (error) {
      showToast('Erro ao carregar configurações', 'error');
    } finally {
      setLoadingConfig(false);
    }
  };

  const handleHeroFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleUploadHero(file);
    e.currentTarget.value = '';
  };

  const handleUploadHero = async (file: File) => {
    setUploadingHero(true);
    try {
      const res = await api.admin.uploadSiteHeroImage(file);
      setHeroImageUrl(res.imageUrl);
      setSiteConfig(res.config);
      showToast('Imagem enviada com sucesso!', 'success');
      loadConfig();
    } catch (error) {
      showToast('Erro ao enviar imagem', 'error');
    } finally {
      setUploadingHero(false);
    }
  };

  const handleUpdateConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroImageUrl.trim()) {
      showToast('URL da imagem é obrigatória', 'error');
      return;
    }
    try {
      await api.admin.updateSiteConfig({ heroImageUrl });
      showToast('Configurações atualizadas com sucesso!', 'success');
      loadConfig();
    } catch (error) {
      showToast('Erro ao atualizar configurações', 'error');
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  // ─── Helpers de formatação ────────────────────────────────────────────────
  const fmtPrice = (v: number) =>
    `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {ToastComponent}

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <h1 className="font-bold text-gray-900 truncate text-base sm:text-xl lg:text-2xl">
              <span className="sm:hidden">⚙️ Admin</span>
              <span className="hidden sm:inline">Painel Administrativo – Flor de Maio</span>
            </h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm whitespace-nowrap"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Tabs ───────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b sticky top-[53px] sm:top-[65px] z-10">
        <div className="max-w-7xl mx-auto">
          {/* overflow-x-auto p/ scroll horizontal no mobile */}
          <div className="flex overflow-x-auto scrollbar-none">
            {(
              [
                { key: 'products',   icon: <Package className="w-4 h-4 sm:w-5 sm:h-5" />,     label: 'Produtos'       },
                { key: 'categories', icon: <FolderOpen className="w-4 h-4 sm:w-5 sm:h-5" />,  label: 'Categorias'     },
                { key: 'carts',      icon: <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />,label: 'Carrinhos'      },
                { key: 'config',     icon: <Settings className="w-4 h-4 sm:w-5 sm:h-5" />,    label: 'Configurações'  },
              ] as const
            ).map(({ key, icon, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-3 sm:py-4 border-b-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base flex-shrink-0 ${
                  activeTab === key
                    ? 'border-[rgb(254,0,0)] text-[rgb(254,0,0)]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">

        {/* ════════════════ Tab: Produtos ════════════════ */}
        {activeTab === 'products' && (
          <div>
            {/* Cabeçalho da seção */}
            <div className="flex justify-between items-center mb-4 sm:mb-6 gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Gerenciar Produtos</h2>
              <button
                onClick={() => { setEditingProduct(undefined); setShowProductForm(true); }}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-[rgb(254,0,0)] text-white rounded-lg hover:bg-[rgb(220,0,0)] transition-colors text-sm sm:text-base whitespace-nowrap"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="sm:hidden">Novo</span>
                <span className="hidden sm:inline">Novo Produto</span>
              </button>
            </div>

            {loadingProducts ? (
              <Loading />
            ) : (
              <div className="bg-white rounded-xl shadow overflow-hidden">

                {/* ── Mobile: cards ───────────────────────── */}
                <div className="sm:hidden divide-y divide-gray-100">
                  {products.map((product) => (
                    <div key={product.id} className="p-3 flex gap-3 items-start">
                      {/* Thumbnail */}
                      <div className="w-14 h-14 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200 flex items-center justify-center">
                        {product.imageUrl ? (
                          <img
                            src={`${import.meta.env.VITE_API_URL}${product.imageUrl}`}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = 'https://placehold.co/100?text=Sem+Foto';
                            }}
                          />
                        ) : (
                          <Images className="w-6 h-6 text-gray-400" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1 mb-0.5">
                          <p className="font-semibold text-sm text-gray-900 leading-tight">{product.name}</p>
                          <button
                            onClick={() => handleToggleProduct(product.id)}
                            className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ml-1 ${
                              product.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {product.active ? 'Ativo' : 'Inativo'}
                          </button>
                        </div>
                        <p className="text-sm font-medium text-gray-700 mb-1">{fmtPrice(product.price)}</p>
                        <div className="flex flex-wrap gap-1">
                          {product.categories && product.categories.length > 0 ? (
                            product.categories.map((pc) => (
                              <span key={pc.id} className="inline-block px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                {pc.category.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400 italic text-xs">Sem categoria</span>
                          )}
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex flex-col gap-2.5 flex-shrink-0 pt-0.5">
                        <button
                          onClick={() => { setManagingImagesProduct(product); setShowProductImages(true); }}
                          className="text-purple-600 hover:text-purple-900"
                          title="Gerenciar imagens"
                        >
                          <Images className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => { setEditingProduct(product); setShowProductForm(true); }}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Deletar"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ── Desktop: tabela ─────────────────────── */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Imagem</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preço</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                              {product.imageUrl ? (
                                <img
                                  src={`${import.meta.env.VITE_API_URL}${product.imageUrl}`}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = 'https://placehold.co/100?text=Sem+Foto';
                                  }}
                                />
                              ) : (
                                <Images className="w-6 h-6 text-gray-400" />
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{product.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fmtPrice(product.price)}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <div className="flex flex-wrap gap-1">
                              {product.categories && product.categories.length > 0 ? (
                                product.categories.map((pc) => (
                                  <span key={pc.id} className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                    {pc.category.name}
                                  </span>
                                ))
                              ) : (
                                <span className="text-gray-400 italic">Sem categoria</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleToggleProduct(product.id)}
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                product.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {product.active ? 'Ativo' : 'Inativo'}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => { setManagingImagesProduct(product); setShowProductImages(true); }}
                              className="text-purple-600 hover:text-purple-900 mr-3"
                              title="Gerenciar imagens"
                            >
                              <Images className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => { setEditingProduct(product); setShowProductForm(true); }}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                              title="Editar produto"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Deletar produto"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {!loadingProducts && products.length > 0 && (
              <Pagination pagination={productsPagination} onPageChange={handleProductsPageChange} />
            )}
          </div>
        )}

        {/* ════════════════ Tab: Categorias ════════════════ */}
        {activeTab === 'categories' && (
          <div>
            <div className="flex justify-between items-center mb-4 sm:mb-6 gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Gerenciar Categorias</h2>
              <button
                onClick={() => { setEditingCategory(undefined); setShowCategoryForm(true); }}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-[rgb(254,0,0)] text-white rounded-lg hover:bg-[rgb(220,0,0)] transition-colors text-sm sm:text-base whitespace-nowrap"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="sm:hidden">Nova</span>
                <span className="hidden sm:inline">Nova Categoria</span>
              </button>
            </div>

            {loadingCategories ? (
              <Loading />
            ) : (
              <div className="bg-white rounded-xl shadow overflow-hidden">

                {/* ── Mobile: cards ───────────────────────── */}
                <div className="sm:hidden divide-y divide-gray-100">
                  {categories.map((category) => (
                    <div key={category.id} className="px-4 py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400 mb-0.5">#{category.id}</p>
                        <p className="font-medium text-sm text-gray-900 truncate">{category.name}</p>
                      </div>
                      <div className="flex gap-4 flex-shrink-0">
                        <button
                          onClick={() => { setEditingCategory(category); setShowCategoryForm(true); }}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Deletar"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ── Desktop: tabela ─────────────────────── */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {categories.map((category) => (
                        <tr key={category.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{category.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => { setEditingCategory(category); setShowCategoryForm(true); }}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {!loadingCategories && categories.length > 0 && (
              <Pagination pagination={categoriesPagination} onPageChange={handleCategoriesPageChange} />
            )}
          </div>
        )}

        {/* ════════════════ Tab: Carrinhos ════════════════ */}
        {activeTab === 'carts' && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Carrinhos Criados</h2>

            {loadingCarts ? (
              <Loading />
            ) : (
              <div className="bg-white rounded-xl shadow overflow-hidden">

                {/* ── Mobile: cards ───────────────────────── */}
                <div className="sm:hidden divide-y divide-gray-100">
                  {carts.map((cart) => {
                    const total = cart.items.reduce((sum, item) => sum + item.price * item.qty, 0);
                    return (
                      <div key={cart.id} className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-gray-900">{cart.customerName}</p>
                            <p className="text-xs text-gray-500">{cart.phone}</p>
                          </div>
                          <a
                            href={`/carrinho/${cart.uid}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900 flex-shrink-0"
                            title="Abrir carrinho"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 gap-2">
                          <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded truncate max-w-[120px]">
                            {cart.uid}
                          </span>
                          <span className="font-semibold text-gray-900 text-sm">{fmtPrice(total)}</span>
                          <span>{new Date(cart.createdAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ── Desktop: tabela ─────────────────────── */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">UID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Link</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {carts.map((cart) => {
                        const total = cart.items.reduce((sum, item) => sum + item.price * item.qty, 0);
                        return (
                          <tr key={cart.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{cart.uid}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{cart.customerName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cart.phone}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{fmtPrice(total)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(cart.createdAt).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <a
                                href={`/carrinho/${cart.uid}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <ExternalLink className="w-5 h-5 inline" />
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {!loadingCarts && carts.length > 0 && (
              <Pagination pagination={cartsPagination} onPageChange={handleCartsPageChange} />
            )}
          </div>
        )}

        {/* ════════════════ Tab: Configurações ════════════════ */}
        {activeTab === 'config' && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Configurações do Site</h2>

            {loadingConfig ? (
              <Loading />
            ) : (
              <div className="bg-white rounded-xl shadow p-4 sm:p-6">
                <form onSubmit={handleUpdateConfig} className="space-y-5 sm:space-y-6">
                  {/* Hero Image URL */}
                  <div>
                    <label htmlFor="heroImageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                      URL da Imagem de Fundo da Hero
                    </label>
                    <input
                      type="url"
                      id="heroImageUrl"
                      value={heroImageUrl}
                      onChange={(e) => setHeroImageUrl(e.target.value)}
                      placeholder="https://exemplo.com/imagem.jpg"
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(254,0,0)] focus:border-transparent text-sm sm:text-base"
                      required
                    />
                    <p className="mt-1 text-xs sm:text-sm text-gray-500">
                      Esta imagem aparecerá como fundo da seção Hero na página inicial (onde está escrito "40 Anos Encantando São Luís...")
                    </p>
                  </div>

                  {/* Preview */}
                  {heroImageUrl && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prévia da Imagem
                      </label>
                      <div className="relative w-full h-48 sm:h-64 rounded-lg overflow-hidden border border-gray-300">
                        <img
                          src={heroImageUrl}
                          alt="Preview"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.src = '';
                            e.currentTarget.alt = 'Erro ao carregar imagem';
                          }}
                        />
                      </div>

                      <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <input
                          id="heroUploadInput"
                          type="file"
                          accept="image/*"
                          onChange={handleHeroFileChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="heroUploadInput"
                          className="w-full sm:w-auto text-center px-4 py-2 bg-gray-100 rounded-md cursor-pointer text-sm hover:bg-gray-200 transition-colors"
                        >
                          Selecionar arquivo
                        </label>
                        <button
                          type="button"
                          onClick={() => document.getElementById('heroUploadInput')?.click()}
                          disabled={uploadingHero}
                          className="w-full sm:w-auto px-4 py-2 bg-[rgb(254,0,0)] text-white rounded-lg hover:bg-[rgb(220,0,0)] transition-colors text-sm disabled:opacity-60"
                        >
                          {uploadingHero ? 'Enviando...' : 'Enviar Imagem'}
                        </button>
                        <p className="text-xs sm:text-sm text-gray-500">
                          ou cole a URL acima e clique em Salvar
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Submit */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-2.5 bg-[rgb(254,0,0)] text-white rounded-lg hover:bg-[rgb(220,0,0)] transition-colors font-medium text-sm sm:text-base"
                    >
                      Salvar Configurações
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      {showProductForm && (
        <ProductForm
          product={editingProduct}
          categories={categories}
          onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
          onClose={() => { setShowProductForm(false); setEditingProduct(undefined); }}
        />
      )}

      {showCategoryForm && (
        <CategoryForm
          category={editingCategory}
          onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
          onClose={() => { setShowCategoryForm(false); setEditingCategory(undefined); }}
        />
      )}

      {showProductImages && managingImagesProduct && (
        <ProductImagesModal
          product={managingImagesProduct}
          onClose={() => { setShowProductImages(false); setManagingImagesProduct(undefined); }}
          onUpdate={() => { loadProducts(); }}
        />
      )}
    </div>
  );
}

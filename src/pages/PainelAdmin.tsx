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
    const token = localStorage.getItem('adminToken');
    if (token) {
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

  const handleLogin = async (username: string, password: string) => {
    try {
      const token = await api.admin.login(username, password);
      localStorage.setItem('adminToken', token);
      // Testar autenticação fazendo uma requisição para garantir que token está válido
      await api.getCategories();
      setIsAuthenticated(true);
      showToast('Login realizado com sucesso!', 'success');
    } catch (error: any) {
      localStorage.removeItem('adminToken');
      showToast(error.message || 'Usuário ou senha incorretos', 'error');
      throw error;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
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

  // Funções de mudança de página
  const handleProductsPageChange = (page: number) => {
    setProductsPage(page);
  };

  const handleCategoriesPageChange = (page: number) => {
    setCategoriesPage(page);
  };

  const handleCartsPageChange = (page: number) => {
    setCartsPage(page);
  };

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
    // limpa o input
    e.currentTarget.value = '';
  };

  const handleUploadHero = async (file: File) => {
    setUploadingHero(true);
    try {
      const res = await api.admin.uploadSiteHeroImage(file);
      setHeroImageUrl(res.imageUrl);
      setSiteConfig(res.config);
      showToast('Imagem enviada com sucesso!', 'success');
      // recarregar configurações do servidor para garantir estado consistente
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

  return (
    <div className="min-h-screen bg-gray-50">
      {ToastComponent}

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Painel Administrativo - Flor de Maio
            </h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'products'
                  ? 'border-[rgb(254,0,0)] text-[rgb(254,0,0)]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Package className="w-5 h-5" />
              Produtos
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'categories'
                  ? 'border-[rgb(254,0,0)] text-[rgb(254,0,0)]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <FolderOpen className="w-5 h-5" />
              Categorias
            </button>
            <button
              onClick={() => setActiveTab('carts')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'carts'
                  ? 'border-[rgb(254,0,0)] text-[rgb(254,0,0)]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              Carrinhos
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'config'
                  ? 'border-[rgb(254,0,0)] text-[rgb(254,0,0)]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings className="w-5 h-5" />
              Configurações
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab: Produtos */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Gerenciar Produtos</h2>
              <button
                onClick={() => {
                  setEditingProduct(undefined);
                  setShowProductForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[rgb(254,0,0)] text-white rounded-lg hover:bg-[rgb(220,0,0)] transition-colors"
              >
                <Plus className="w-5 h-5" />
                Novo Produto
              </button>
            </div>

            {loadingProducts ? (
              <Loading />
            ) : (
              <div className="bg-white rounded-xl shadow overflow-hidden">
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
                                  // Fallback caso a imagem não carregue
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = "https://placehold.co/100?text=Sem+Foto";
                                }}
                              />
                            ) : (
                              <Images className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{product.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          R$ {product.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="flex flex-wrap gap-1">
                            {product.categories && product.categories.length > 0 ? (
                              product.categories.map((pc) => (
                                <span
                                  key={pc.id}
                                  className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                                >
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
                              product.active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {product.active ? 'Ativo' : 'Inativo'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              setManagingImagesProduct(product);
                              setShowProductImages(true);
                            }}
                            className="text-purple-600 hover:text-purple-900 mr-3"
                            title="Gerenciar imagens"
                          >
                            <Images className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setShowProductForm(true);
                            }}
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
            )}

            {!loadingProducts && products.length > 0 && (
              <Pagination pagination={productsPagination} onPageChange={handleProductsPageChange} />
            )}
          </div>
        )}

        {/* Tab: Categorias */}
        {activeTab === 'categories' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Gerenciar Categorias</h2>
              <button
                onClick={() => {
                  setEditingCategory(undefined);
                  setShowCategoryForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[rgb(254,0,0)] text-white rounded-lg hover:bg-[rgb(220,0,0)] transition-colors"
              >
                <Plus className="w-5 h-5" />
                Nova Categoria
              </button>
            </div>

            {loadingCategories ? (
              <Loading />
            ) : (
              <div className="bg-white rounded-xl shadow overflow-hidden">
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
                            onClick={() => {
                              setEditingCategory(category);
                              setShowCategoryForm(true);
                            }}
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
            )}

            {!loadingCategories && categories.length > 0 && (
              <Pagination pagination={categoriesPagination} onPageChange={handleCategoriesPageChange} />
            )}
          </div>
        )}

        {/* Tab: Carrinhos */}
        {activeTab === 'carts' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Carrinhos Criados</h2>

            {loadingCarts ? (
              <Loading />
            ) : (
              <div className="bg-white rounded-xl shadow overflow-hidden">
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
                      const total = cart.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
                      return (
                        <tr key={cart.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{cart.uid}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{cart.customerName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cart.phone}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            R$ {total.toFixed(2)}
                          </td>
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
            )}

            {!loadingCarts && carts.length > 0 && (
              <Pagination pagination={cartsPagination} onPageChange={handleCartsPageChange} />
            )}
          </div>
        )}

        {/* Tab: Configurações */}
        {activeTab === 'config' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Configurações do Site</h2>

            {loadingConfig ? (
              <Loading />
            ) : (
              <div className="bg-white rounded-xl shadow p-6">
                <form onSubmit={handleUpdateConfig} className="space-y-6">
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(254,0,0)] focus:border-transparent"
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Esta imagem aparecerá como fundo da seção Hero na página inicial (onde está escrito "40 Anos Encantando São Luís...")
                    </p>
                  </div>

                  {/* Preview */}
                  {heroImageUrl && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prévia da Imagem
                      </label>
                      <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-300">
                        <img
                          src={heroImageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '';
                            e.currentTarget.alt = 'Erro ao carregar imagem';
                          }}
                        />
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        <input
                          id="heroUploadInput"
                          type="file"
                          accept="image/*"
                          onChange={handleHeroFileChange}
                          className="hidden"
                        />
                        <label htmlFor="heroUploadInput" className="px-4 py-2 bg-gray-100 rounded-md cursor-pointer">
                          Selecionar arquivo
                        </label>
                        <button
                          type="button"
                          onClick={() => document.getElementById('heroUploadInput')?.click()}
                          disabled={uploadingHero}
                          className="px-4 py-2 bg-[rgb(254,0,0)] text-white rounded-lg hover:bg-[rgb(220,0,0)] transition-colors"
                        >
                          {uploadingHero ? 'Enviando...' : 'Enviar Imagem'}
                        </button>
                        <p className="text-sm text-gray-500">ou cole a URL acima e clique em Salvar Configurações</p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[rgb(254,0,0)] text-white rounded-lg hover:bg-[rgb(220,0,0)] transition-colors font-medium"
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

      {/* Modals */}
      {showProductForm && (
        <ProductForm
          product={editingProduct}
          categories={categories}
          onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(undefined);
          }}
        />
      )}

      {showCategoryForm && (
        <CategoryForm
          category={editingCategory}
          onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
          onClose={() => {
            setShowCategoryForm(false);
            setEditingCategory(undefined);
          }}
        />
      )}

      {showProductImages && managingImagesProduct && (
        <ProductImagesModal
          product={managingImagesProduct}
          onClose={() => {
            setShowProductImages(false);
            setManagingImagesProduct(undefined);
          }}
          onUpdate={() => {
            loadProducts();
          }}
        />
      )}
    </div>
  );
}

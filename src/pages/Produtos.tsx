import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { api } from '../services/api';
import { Product, Category, Pagination as PaginationType } from '../types';
import { useCart } from '../contexts/CartContext';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';

export default function Produtos() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const { addToCart, openDrawer } = useCart();

  useEffect(() => {
    const categoryParam = searchParams.get('categoria');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await api.getCategories();
        setCategories(result.data);
      } catch (err) {
        console.error('Erro ao carregar categorias:', err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const filters: { active: string; category?: string; page: number; limit: number } = {
          active: 'true',
          page: currentPage,
          limit: 12
        };
        if (selectedCategory) {
          filters.category = selectedCategory;
        }
        const result = await api.getProducts(filters);
        setProducts(result.data);
        setPagination(result.pagination);
      } catch (err) {
        setError('Erro ao carregar produtos. Tente novamente.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset para primeira página ao mudar categoria
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    openDrawer();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1a1a1a] mb-4">
            Nossos Produtos
          </h1>
          <p className="text-lg text-gray-600">
            Explore nossa coleção completa de arranjos e presentes
          </p>
        </div>

        {/* Filtro de Categorias */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleCategoryChange('')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === ''
                  ? 'bg-[rgb(254,0,0)] text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Todas
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id.toString())}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category.id.toString()
                    ? 'bg-[rgb(254,0,0)] text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && <Loading />}

        {/* Error State */}
        {error && (
          <div className="text-center text-red-600 p-8 bg-white rounded-lg">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-[rgb(254,0,0)] text-white rounded-lg hover:bg-[rgb(220,0,0)]"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {/* Grid de Produtos */}
        {!loading && !error && (
          <>
            {products.length === 0 ? (
              <div className="text-center text-gray-600 p-8 bg-white rounded-lg">
                <p>Nenhum produto encontrado nesta categoria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Imagem */}
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>

                    {/* Conteúdo */}
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2 line-clamp-2">
                        {product.name}
                      </h3>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold text-[rgb(254,0,0)]">
                          R$ {product.price.toFixed(2).replace('.', ',')}
                        </span>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full flex items-center justify-center gap-2 bg-[rgb(254,0,0)] text-white px-4 py-3 rounded-lg font-semibold hover:bg-[rgb(220,0,0)] transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Adicionar ao Carrinho
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          </>
        )}
      </div>
    </div>
  );
}

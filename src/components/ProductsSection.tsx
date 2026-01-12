import { useState, useEffect } from 'react';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { api } from '../services/api';
import { Product, Pagination as PaginationType } from '../types';
import { useCart } from '../contexts/CartContext';
import Loading from './Loading';
import { getImageUrl } from '../utils/imageUrl';

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    limit: 8,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const { addToCart, openDrawer } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await api.getProducts({ active: 'true', page: 1, limit: 8 });
        if (result && result.data) {
          setProducts(result.data);
          setPagination(result.pagination);
        } else {
          setError('Erro ao carregar produtos. Tente novamente.');
        }
      } catch (err) {
        setError('Erro ao carregar produtos. Tente novamente.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    openDrawer();
  };

  if (loading) {
    return (
      <section id="produtos" className="bg-white py-16 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          <Loading />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="produtos" className="bg-white py-16 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center text-red-600 p-8">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-[rgb(254,0,0)] text-white rounded-lg hover:bg-[rgb(220,0,0)]"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="produtos" className="bg-white py-16 lg:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-block bg-[rgba(254,0,0,0.1)] text-[rgb(254,0,0)] px-5 py-2 rounded-full text-sm font-bold tracking-wide mb-4">
            NOSSOS DESTAQUES
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a1a1a] mb-4 leading-tight">
            Produtos Mais Amados<br className="hidden sm:block" /> Pelos Nossos Clientes
          </h2>
          <p className="text-base lg:text-lg text-[#4a4a4a] max-w-2xl mx-auto">
            Selecionamos os arranjos e presentes que fazem mais sucesso
          </p>
        </div>

        {/* Grid de Produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mb-12 lg:mb-14">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] overflow-hidden hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-400 cursor-pointer"
            >
              {/* Container da Imagem */}
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                {(() => {
                  // Prioriza o array de imagens, senão usa imageUrl
                  const images = product.images && product.images.length > 0
                    ? product.images.map(img => img.imageUrl)
                    : product.imageUrl ? [product.imageUrl] : [];

                  const imageToShow = images[0] || '';
                  const hasMultipleImages = images.length > 1;

                  return (
                    <>
                      <img
                        src={getImageUrl(imageToShow)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />

                      {/* Indicador de múltiplas imagens */}
                      {hasMultipleImages && (
                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                          {images.length}
                        </div>
                      )}

                      {/* Overlay no Hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                    </>
                  );
                })()}
              </div>

              {/* Conteúdo do Card */}
              <div className="p-5 lg:p-6">
                <h3 className="text-base lg:text-lg font-semibold text-[#1a1a1a] mb-3 min-h-[3rem] line-clamp-2 leading-snug">
                  {product.name}
                </h3>

                {/* Descrição */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>

                {/* Category badges */}
                {product.categories && product.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {product.categories.map((pc) => (
                      <span
                        key={pc.id}
                        className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                      >
                        {pc.category.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Área de Preços */}
                <div className="flex items-center gap-2.5 mb-4 flex-wrap">
                  <span className="text-xl lg:text-2xl font-bold text-[rgb(254,0,0)] tracking-tight">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                {/* Botão de Ação */}
                <button
                  onClick={(e) => handleAddToCart(product, e)}
                  className="group/btn w-full flex items-center justify-center gap-2 bg-[rgb(254,0,0)] text-white px-4 py-3 lg:py-3.5 rounded-xl font-semibold text-sm lg:text-base hover:bg-[rgb(220,0,0)] transition-all duration-300 shadow-[0_4px_12px_rgba(254,0,0,0.25)] hover:shadow-[0_6px_20px_rgba(254,0,0,0.35)] hover:-translate-y-0.5"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Final */}
        <div className="text-center">
          <a
            href="/produtos"
            className="inline-flex items-center gap-3 bg-[rgb(254,0,0)] text-white px-8 lg:px-12 py-4 lg:py-5 rounded-xl font-semibold text-base lg:text-lg hover:bg-[rgb(220,0,0)] transition-all duration-300 shadow-[0_8px_24px_rgba(254,0,0,0.3)] hover:shadow-[0_12px_32px_rgba(254,0,0,0.4)] hover:scale-105"
          >
            Ver Todos os Produtos no Catálogo
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}

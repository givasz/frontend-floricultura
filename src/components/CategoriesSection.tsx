import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Category, Pagination as PaginationType } from '../types';
import Loading from './Loading';
import Pagination from './Pagination';

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await api.getCategories({ page: currentPage, limit: 10 });
        if (result && result.data) {
          setCategories(result.data);
          setPagination(result.pagination);
        } else {
          setError('Erro ao carregar categorias. Tente novamente.');
        }
      } catch (err) {
        setError('Erro ao carregar categorias. Tente novamente.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getIconForCategory = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('rosa')) return '🌹';
    if (lowerName.includes('cesta')) return '🎁';
    if (lowerName.includes('pelúcia') || lowerName.includes('pelucia')) return '🧸';
    if (lowerName.includes('girassol')) return '🌻';
    if (lowerName.includes('romântico') || lowerName.includes('romantico')) return '💝';
    if (lowerName.includes('evento')) return '🎉';
    return '🌸';
  };

  if (loading) {
    return (
      <section id="categorias" className="bg-[var(--cinza-claro)] py-16 lg:py-28 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Loading />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="categorias" className="bg-[var(--cinza-claro)] py-16 lg:py-28 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
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

  if (categories.length === 0) {
    return (
      <section id="categorias" className="bg-[var(--cinza-claro)] py-16 lg:py-28 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-gray-600 p-8">
            <p>Nenhuma categoria disponível no momento.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="categorias" className="bg-[var(--cinza-claro)] py-16 lg:py-28 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl lg:text-5xl font-bold text-center text-[var(--texto-escuro)] mb-12 lg:mb-16">
          Encontre o Presente Perfeito Para Cada Ocasião
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`/produtos?categoria=${category.id}`}
              className="relative h-80 rounded-[20px] overflow-hidden group cursor-pointer hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 bg-gradient-to-br from-[rgb(254,0,0)] to-[rgb(200,0,0)]"
            >
              {category.imageUrl && (
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/40 group-hover:from-[rgba(254,0,0,0.9)] group-hover:via-[rgba(254,0,0,0.5)] transition-all duration-300" />

              <div className="relative h-full flex flex-col items-center justify-center text-center text-white p-6">
                {!category.imageUrl && (
                  <div className="text-5xl mb-4">
                    {getIconForCategory(category.name)}
                  </div>
                )}
                <h3 className="text-2xl lg:text-3xl font-bold mb-2">
                  {category.name}
                </h3>
                <p className="text-base opacity-90">
                  Explore esta categoria
                </p>
              </div>
            </a>
          ))}
        </div>

        <Pagination pagination={pagination} onPageChange={handlePageChange} />
      </div>
    </section>
  );
}

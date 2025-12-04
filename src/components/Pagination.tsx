import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Pagination as PaginationType } from '../types';

interface PaginationProps {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
}

export default function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { page, totalPages, hasPrevPage, hasNextPage, total } = pagination;

  if (totalPages <= 1) {
    return null;
  }

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            i === page
              ? 'bg-[rgb(254,0,0)] text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            hasPrevPage
              ? 'bg-white text-gray-700 hover:bg-gray-100'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </button>

        <div className="flex gap-2">
          {renderPageNumbers()}
        </div>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            hasNextPage
              ? 'bg-white text-gray-700 hover:bg-gray-100'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Próxima
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <p className="text-sm text-gray-600">
        Mostrando página {page} de {totalPages} ({total} {total === 1 ? 'item' : 'itens'} no total)
      </p>
    </div>
  );
}

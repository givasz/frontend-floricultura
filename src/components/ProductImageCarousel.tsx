import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../types';
import { getImageUrl } from '../utils/imageUrl';

interface ProductImageCarouselProps {
  product: Product;
  className?: string;
}

export default function ProductImageCarousel({ product, className = '' }: ProductImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Prioriza o array de imagens, senão usa imageUrl como fallback
  const images = product.images && product.images.length > 0
    ? product.images.map(img => img.imageUrl)
    : product.imageUrl
      ? [product.imageUrl]
      : [];

  if (images.length === 0) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <p className="text-gray-500">Sem imagens disponíveis</p>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Imagem Principal */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-lg">
        <img
          src={getImageUrl(images[currentIndex])}
          alt={`${product.name} - Imagem ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />

        {/* Navegação (apenas se tiver mais de 1 imagem) */}
        {images.length > 1 && (
          <>
            {/* Botão Anterior */}
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              aria-label="Imagem anterior"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Botão Próximo */}
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              aria-label="Próxima imagem"
            >
              <ChevronRight size={24} />
            </button>

            {/* Indicador de posição */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails (apenas se tiver mais de 1 imagem) */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
          {images.map((imageUrl, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`
                flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all
                ${currentIndex === index ? 'border-[rgb(254,0,0)] ring-2 ring-[rgb(254,0,0)]/30' : 'border-gray-300 hover:border-gray-400'}
              `}
            >
              <img
                src={getImageUrl(imageUrl)}
                alt={`${product.name} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

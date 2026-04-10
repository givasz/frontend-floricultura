import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../types';
import { getImageUrl } from '../utils/imageUrl';

interface ProductImageCarouselProps {
  product: Product;
}

export default function ProductImageCarousel({ product }: ProductImageCarouselProps) {
  const [current, setCurrent] = useState(0);

  // Mescla imageUrl (capa) + product.images, sem duplicatas
  const extraImages = product.images?.map((img) => img.imageUrl) ?? [];
  const images: string[] = [
    ...(product.imageUrl && !extraImages.includes(product.imageUrl) ? [product.imageUrl] : []),
    ...extraImages,
  ];

  const total = images.length;

  if (total === 0) {
    return (
      <div className="relative aspect-square bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400 text-sm">Sem imagem</span>
      </div>
    );
  }

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((c) => (c - 1 + total) % total);
  };

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((c) => (c + 1) % total);
  };

  return (
    <div className="relative aspect-square overflow-hidden bg-gray-100 group/carousel">
      <img
        key={current}
        src={getImageUrl(images[current])}
        alt={product.name}
        className="w-full h-full object-cover transition-opacity duration-200"
        loading="lazy"
      />

      {total > 1 && (
        <>
          {/* Setas — aparecem no hover */}
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full p-1 opacity-0 group-hover/carousel:opacity-100 transition-opacity z-10"
            aria-label="Imagem anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full p-1 opacity-0 group-hover/carousel:opacity-100 transition-opacity z-10"
            aria-label="Próxima imagem"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === current ? 'bg-white w-3' : 'bg-white/60 hover:bg-white/90'
                }`}
                aria-label={`Imagem ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

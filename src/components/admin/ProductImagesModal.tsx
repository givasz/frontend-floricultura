import React from 'react';
import { X } from 'lucide-react';
import { Product } from '../../types';
import MultipleImageUpload from './MultipleImageUpload';
import ImageGalleryManager from './ImageGalleryManager';

interface ProductImagesModalProps {
  product: Product;
  onClose: () => void;
  onUpdate?: () => void;
}

export default function ProductImagesModal({ product, onClose, onUpdate }: ProductImagesModalProps) {
  const handleUpdate = () => {
    onUpdate?.();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Gerenciar Imagens
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {product.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-8">
          {/* Seção 1: Upload de Múltiplas Imagens */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              1. Adicionar Novas Imagens
            </h3>
            <MultipleImageUpload
              productId={product.id}
              onSuccess={handleUpdate}
            />
          </div>

          {/* Seção 2: Gerenciar Imagens Existentes */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              2. Gerenciar Imagens Existentes
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Reorganize a ordem das imagens ou delete imagens indesejadas.
            </p>
            <ImageGalleryManager
              productId={product.id}
              onUpdate={handleUpdate}
            />
          </div>

          {/* Informação adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              💡 <strong>Dica:</strong> A primeira imagem será exibida como imagem principal do produto.
              Use os botões de seta para reordenar as imagens e clique em "Salvar Ordem".
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

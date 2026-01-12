import { useState } from 'react';
import { X } from 'lucide-react';
import { Product, Category } from '../../types';
import ImageUpload from './ImageUpload';

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  onSubmit: (data: any) => Promise<void>;
  onClose: () => void;
}

export default function ProductForm({ product, categories, onSubmit, onClose }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    imageUrl: product?.imageUrl || '',
    categoryIds: product?.categories?.map(pc => pc.categoryId) || [],
    active: product?.active !== undefined ? product.active : true
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {product ? 'Editar Produto' : 'Novo Produto'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Produto
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(254,0,0)] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(254,0,0)] focus:border-transparent resize-none"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preço (R$)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.price || ''}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(254,0,0)] focus:border-transparent"
              required
            />
          </div>

          <ImageUpload
            currentImageUrl={formData.imageUrl}
            onImageUrlChange={(url) => setFormData({ ...formData, imageUrl: url })}
            uploadEndpoint="products"
            label="Imagem do Produto"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Categorias (selecione uma ou mais)
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-4">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.categoryIds.includes(category.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          categoryIds: [...formData.categoryIds, category.id]
                        });
                      } else {
                        setFormData({
                          ...formData,
                          categoryIds: formData.categoryIds.filter(id => id !== category.id)
                        });
                      }
                    }}
                    className="w-5 h-5 text-[rgb(254,0,0)] rounded focus:ring-[rgb(254,0,0)] cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-5 h-5 text-[rgb(254,0,0)] rounded focus:ring-[rgb(254,0,0)]"
            />
            <label htmlFor="active" className="text-sm font-medium text-gray-700">
              Produto Ativo
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-[rgb(254,0,0)] text-white rounded-lg font-semibold hover:bg-[rgb(220,0,0)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

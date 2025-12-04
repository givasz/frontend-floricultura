import { useState } from 'react';
import { X } from 'lucide-react';
import { Category } from '../../types';

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: { name: string; imageUrl?: string }) => Promise<void>;
  onClose: () => void;
}

export default function CategoryForm({ category, onSubmit, onClose }: CategoryFormProps) {
  const [name, setName] = useState(category?.name || '');
  const [imageUrl, setImageUrl] = useState(category?.imageUrl || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit({ name, imageUrl: imageUrl || undefined });
      onClose();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {category ? 'Editar Categoria' : 'Nova Categoria'}
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
              Nome da Categoria
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(254,0,0)] focus:border-transparent"
              placeholder="Ex: Bouquets de Rosas"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL da Imagem (opcional)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(254,0,0)] focus:border-transparent"
              placeholder="https://exemplo.com/imagem.jpg"
            />
            {imageUrl && (
              <div className="mt-2">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
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

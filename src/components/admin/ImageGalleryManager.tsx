import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Trash2, Save } from 'lucide-react';
import { ProductImage } from '../../types';
import { getImageUrl } from '../../utils/imageUrl';

interface ImageGalleryManagerProps {
  productId: number;
  onUpdate?: () => void;
}

export default function ImageGalleryManager({ productId, onUpdate }: ImageGalleryManagerProps) {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadImages();
  }, [productId]);

  const loadImages = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/products/${productId}/images`);

      if (response.ok) {
        const data = await response.json();
        setImages(data);
        setHasChanges(false);
      } else {
        console.error('Erro ao carregar imagens');
      }
    } catch (error) {
      console.error('Erro ao carregar imagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (imageId: number) => {
    if (!confirm('Tem certeza que deseja deletar esta imagem?')) {
      return;
    }

    // Verifica se as credenciais existem antes de enviar
    const credentials = localStorage.getItem('adminCredentials');
    if (!credentials) {
      console.warn('[ImageGalleryManager] adminCredentials não encontrado no localStorage - faça login novamente');
      alert('Sessão expirada. Faça login novamente.');
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

      const response = await fetch(`${API_URL}/products/${productId}/images/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${credentials}`
        }
      });

      if (response.ok) {
        alert('Imagem deletada com sucesso!');
        loadImages();
        onUpdate?.();
      } else {
        alert('Erro ao deletar imagem');
      }
    } catch (error) {
      alert('Erro ao deletar imagem');
    }
  };

  const moveUp = (index: number) => {
    if (index === 0) return;

    const newImages = [...images];
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    setImages(newImages);
    setHasChanges(true);
  };

  const moveDown = (index: number) => {
    if (index === images.length - 1) return;

    const newImages = [...images];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    setImages(newImages);
    setHasChanges(true);
  };

  const saveOrder = async () => {
    // Verifica se as credenciais existem antes de enviar
    const credentials = localStorage.getItem('adminCredentials');
    if (!credentials) {
      console.warn('[ImageGalleryManager] adminCredentials não encontrado no localStorage - faça login novamente');
      alert('Sessão expirada. Faça login novamente.');
      return;
    }

    setSaving(true);

    try {
      // Monta o array de IDs com as novas ordens
      const reorderedImages = images.map((img, index) => ({
        id: img.id,
        order: index
      }));

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

      const response = await fetch(`${API_URL}/products/${productId}/images/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`
        },
        body: JSON.stringify({ images: reorderedImages })
      });

      if (response.ok) {
        alert('Ordem salva com sucesso!');
        setHasChanges(false);
        loadImages();
        onUpdate?.();
      } else {
        alert('Erro ao salvar ordem');
      }
    } catch (error) {
      alert('Erro ao salvar ordem');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Carregando imagens...
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="font-medium">Nenhuma imagem cadastrada</p>
        <p className="text-sm mt-1">Use o formulário acima para adicionar imagens</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Imagens do Produto ({images.length})
        </h3>
        {hasChanges && (
          <button
            onClick={saveOrder}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? 'Salvando...' : 'Salvar Ordem'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3">
        {images.map((img, index) => (
          <div
            key={img.id}
            className="flex items-center gap-4 p-3 bg-white border border-gray-300 rounded-lg hover:shadow-md transition-shadow"
          >
            {/* Número da ordem */}
            <div className="flex-shrink-0 w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center font-bold text-sm">
              {index + 1}
            </div>

            {/* Imagem */}
            <div className="flex-shrink-0">
              <img
                src={getImageUrl(img.imageUrl)}
                alt={`Imagem ${index + 1}`}
                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-600 truncate">
                {img.imageUrl}
              </p>
              <p className="text-xs text-gray-400">
                ID: {img.id}
              </p>
            </div>

            {/* Controles */}
            <div className="flex items-center gap-2">
              {/* Mover para cima */}
              <button
                onClick={() => moveUp(index)}
                disabled={index === 0}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Mover para cima"
              >
                <ChevronUp size={20} />
              </button>

              {/* Mover para baixo */}
              <button
                onClick={() => moveDown(index)}
                disabled={index === images.length - 1}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Mover para baixo"
              >
                <ChevronDown size={20} />
              </button>

              {/* Deletar */}
              <button
                onClick={() => handleDelete(img.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Deletar imagem"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {hasChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            ⚠️ Você alterou a ordem das imagens. Clique em "Salvar Ordem" para confirmar as mudanças.
          </p>
        </div>
      )}
    </div>
  );
}

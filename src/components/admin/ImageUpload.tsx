import React, { useState, useEffect } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageUrlChange: (url: string) => void;
  uploadEndpoint: 'products' | 'categories';
  label?: string;
}

export default function ImageUpload({
  currentImageUrl,
  onImageUrlChange,
  uploadEndpoint,
  label = 'Imagem do Produto'
}: ImageUploadProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Se já tem uma URL (editando produto), usa ela
    if (currentImageUrl) {
      setUploadedUrl(currentImageUrl);
    }
  }, [currentImageUrl]);

  useEffect(() => {
    // Limpa a URL temporária quando desmonta
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const validateFile = (file: File): string | null => {
    // Verifica tipo
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return 'Formato inválido. Use JPEG, PNG, GIF ou WebP.';
    }

    // Verifica tamanho (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return 'Arquivo muito grande! Máximo: 5MB';
    }

    return null;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Valida o arquivo
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      e.target.value = '';
      return;
    }

    setError('');
    setImageFile(file);

    // Cria preview local
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Upload automático
    await uploadImage(file);
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    setError('');

    try {
      // Verifica se as credenciais existem antes de enviar
      const credentials = localStorage.getItem('adminCredentials');
      if (!credentials) {
        console.warn('[ImageUpload] adminCredentials não encontrado no localStorage - faça login novamente');
        setError('Sessão expirada. Faça login novamente.');
        setImageFile(null);
        setPreview(null);
        setUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append('image', file);

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

      // Usa Basic Auth (não definir Content-Type, o FormData cuida disso)
      const response = await fetch(`${API_URL}/${uploadEndpoint}/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setUploadedUrl(data.imageUrl);
        onImageUrlChange(data.imageUrl);
      } else {
        setError(data.error || 'Erro ao enviar imagem');
        setImageFile(null);
        setPreview(null);
      }
    } catch (err) {
      setError('Erro ao enviar imagem. Tente novamente.');
      setImageFile(null);
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreview(null);
    setUploadedUrl('');
    onImageUrlChange('');
    setError('');
  };

  const getImageUrl = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    if (preview) return preview;
    if (uploadedUrl) {
      // Se já é uma URL completa (externa), usa direto
      if (uploadedUrl.startsWith('http')) return uploadedUrl;
      // Se é caminho relativo, adiciona a base URL
      return `${API_URL}${uploadedUrl}`;
    }
    return null;
  };

  const imageUrl = getImageUrl();

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      {/* Preview da imagem ou área de upload */}
      {imageUrl ? (
        <div className="relative inline-block">
          <img
            src={imageUrl}
            alt="Preview"
            className="w-48 h-48 object-cover rounded-lg border-2 border-gray-300"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            disabled={uploading}
          >
            <X size={20} />
          </button>
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
              <div className="text-white text-sm font-medium">
                Enviando...
              </div>
            </div>
          )}
        </div>
      ) : (
        <label
          className={`
            flex flex-col items-center justify-center w-48 h-48
            border-2 border-dashed rounded-lg cursor-pointer
            transition-colors
            ${uploading ? 'border-gray-300 bg-gray-50' : 'border-gray-400 hover:border-pink-500 hover:bg-pink-50'}
          `}
        >
          <div className="flex flex-col items-center justify-center py-6">
            {uploading ? (
              <>
                <Upload className="w-10 h-10 text-gray-400 animate-pulse" />
                <p className="mt-2 text-sm text-gray-500">Enviando...</p>
              </>
            ) : (
              <>
                <ImageIcon className="w-10 h-10 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Clique para escolher</p>
                <p className="text-xs text-gray-400">PNG, JPG, GIF até 5MB</p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      )}

      {/* Mensagens de erro */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {/* Status de sucesso */}
      {uploadedUrl && !uploading && !error && (
        <div className="text-sm text-green-600 bg-green-50 p-2 rounded flex items-center gap-2">
          <span>✓</span>
          <span>Imagem enviada com sucesso!</span>
        </div>
      )}

      {/* Informação sobre mobile */}
      <p className="text-xs text-gray-500">
        No celular: tire uma foto ou escolha da galeria
      </p>
    </div>
  );
}

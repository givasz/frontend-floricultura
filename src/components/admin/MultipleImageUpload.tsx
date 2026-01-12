import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';

interface MultipleImageUploadProps {
  productId: number;
  onSuccess?: () => void;
}

export default function MultipleImageUpload({ productId, onSuccess }: MultipleImageUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    // Limita a 10 imagens
    if (files.length > 10) {
      setError('Máximo de 10 imagens por vez');
      return;
    }

    // Valida cada arquivo
    const validFiles: File[] = [];
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        setError(`${file.name}: formato inválido. Use JPEG, PNG, GIF ou WebP.`);
        continue;
      }
      if (file.size > maxSize) {
        setError(`${file.name}: arquivo muito grande (máx: 5MB)`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setError('');
    setSelectedFiles(validFiles);

    // Gera previews
    const previewUrls = validFiles.map(file => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);

    // Revoga a URL do preview removido
    URL.revokeObjectURL(previews[index]);

    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError('Selecione pelo menos uma imagem');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();

      // Adiciona todas as imagens com o mesmo nome de campo
      selectedFiles.forEach(file => {
        formData.append('images', file);
      });

      const token = localStorage.getItem('adminToken');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

      const response = await fetch(`${API_URL}/products/${productId}/images/multiple`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        // Limpa os previews
        previews.forEach(url => URL.revokeObjectURL(url));
        setSelectedFiles([]);
        setPreviews([]);

        alert(data.message || `${selectedFiles.length} imagem(ns) adicionada(s) com sucesso!`);
        onSuccess?.();
      } else {
        setError(data.error || 'Erro ao enviar imagens');
      }
    } catch (err) {
      setError('Erro ao enviar imagens. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Adicionar Múltiplas Imagens
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Selecione até 10 imagens (JPEG, PNG, GIF, WebP - máx 5MB cada)
        </p>

        <label
          className={`
            flex flex-col items-center justify-center w-full h-32
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
                <Upload className="w-10 h-10 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600 font-medium">
                  Clique para selecionar imagens
                </p>
                <p className="text-xs text-gray-400">ou arraste e solte aqui</p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/gif,image/webp"
            multiple
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Previews das imagens selecionadas */}
      {previews.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            {previews.length} imagem(ns) selecionada(s):
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full aspect-square object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  disabled={uploading}
                >
                  <X size={16} />
                </button>
                <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mensagens de erro */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Botão de upload */}
      {selectedFiles.length > 0 && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className="w-full px-6 py-3 bg-[rgb(254,0,0)] text-white rounded-lg font-semibold hover:bg-[rgb(220,0,0)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Enviando...' : `Enviar ${selectedFiles.length} imagem(ns)`}
        </button>
      )}
    </div>
  );
}

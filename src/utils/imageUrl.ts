/**
 * Retorna a URL completa de uma imagem
 * Se a URL já for completa (http/https), retorna ela mesma
 * Se for um caminho relativo (/uploads/...), adiciona a base URL da API
 */
export function getImageUrl(imageUrl: string | undefined | null): string {
  if (!imageUrl) {
    return 'https://via.placeholder.com/400x300?text=Sem+Imagem';
  }

  // Se já é uma URL completa, retorna direto
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // Se é um caminho relativo, adiciona a base URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  return `${API_URL}${imageUrl}`;
}

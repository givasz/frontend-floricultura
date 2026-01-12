import { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { api } from '../services/api';
import { useToast } from '../hooks/useToast';

export default function Carrinho() {
  const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const { showToast, ToastComponent } = useToast();
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup' | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !phone.trim()) {
      showToast('Por favor, preencha seu nome e telefone', 'error');
      return;
    }

    if (items.length === 0) {
      showToast('Adicione produtos ao carrinho antes de finalizar', 'error');
      return;
    }

    setLoading(true);

    try {
      const cartData = {
        customerName: customerName.trim(),
        phone: phone.trim(),
        note: note.trim(),
        deliveryMethod: deliveryMethod ?? 'pickup', // use sua variável de seleção ou um valor padrão
        items: items.map(item => ({
          productId: item.product.id,
          qty: item.quantity
        }))
      };

      const response = await api.createCart(cartData);

      // Criar mensagem para WhatsApp
      const whatsappNumber = '5511999999999'; // Substitua pelo número real
      const message = `Olá! Gostaria de fazer o seguinte pedido:\n\nLink do carrinho: ${response.link}`;
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

      // Abrir WhatsApp
      window.open(whatsappUrl, '_blank');

      // Limpar carrinho e formulário
      clearCart();
      setCustomerName('');
      setPhone('');
      setNote('');
      setDeliveryMethod(null);

      showToast('Carrinho criado com sucesso! Redirecionando para WhatsApp...', 'success');
    } catch (error) {
      console.error('Erro ao criar carrinho:', error);
      showToast('Erro ao criar carrinho. Tente novamente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 sm:py-12 px-4">
        <div className="max-w-md mx-auto mt-10">
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
              Carrinho Vazio
            </h2>
            <p className="text-gray-600 mb-8 text-sm sm:text-base">
              Adicione produtos incríveis ao seu carrinho e comece a comprar!
            </p>
            <a
              href="/produtos"
              className="inline-block bg-[rgb(254,0,0)] text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-[rgb(220,0,0)] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Explorar Produtos
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 sm:py-10 px-4">
      {ToastComponent}
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-2">
            Meu Carrinho
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {items.length} {items.length === 1 ? 'item' : 'itens'} no carrinho
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Lista de Produtos */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 sm:p-6"
              >
                <div className="flex gap-4 sm:gap-6">
                  {/* Imagem */}
                  <div className="w-20 h-20 sm:w-28 sm:h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Informações */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-base sm:text-lg font-semibold text-[#1a1a1a] line-clamp-2 pr-2">
                        {item.product.name}
                      </h3>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0 p-1"
                        aria-label="Remover item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-2">
                      {item.product.description}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      {/* Quantidade */}
                      <div className="flex items-center gap-2 sm:gap-3">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all"
                          aria-label="Diminuir quantidade"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-lg w-10 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all"
                          aria-label="Aumentar quantidade"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Preço */}
                      <div className="flex items-center justify-between sm:justify-end">
                        <span className="text-xs text-gray-500 sm:hidden">Subtotal:</span>
                        <span className="text-xl sm:text-2xl font-bold text-[rgb(254,0,0)]">
                          R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resumo e Formulário */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-6 lg:sticky lg:top-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-6">
                Finalizar Pedido
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome completo *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(254,0,0)] focus:border-[rgb(254,0,0)] transition-all"
                    placeholder="Seu nome"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(254,0,0)] focus:border-[rgb(254,0,0)] transition-all"
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Observações
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(254,0,0)] focus:border-[rgb(254,0,0)] transition-all resize-none"
                    rows={3}
                    placeholder="Ex: Entregar até 18h, incluir cartão de felicitações..."
                  />
                </div>

                {/* Resumo do Total */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Subtotal:</span>
                    <span className="font-semibold text-gray-900">
                      R$ {getTotalPrice().toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <div className="border-t border-gray-300 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total:</span>
                      <span className="text-2xl font-bold text-[rgb(254,0,0)]">
                        R$ {getTotalPrice().toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botão WhatsApp */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#25D366] text-white px-6 py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-[#20ba5a] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-95"
                >
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                  {loading ? 'Enviando...' : 'Enviar no WhatsApp'}
                </button>

                <p className="text-xs text-center text-gray-500 mt-3">
                  Você será redirecionado para o WhatsApp
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

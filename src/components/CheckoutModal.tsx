import { useState } from 'react';
import { X, MessageCircle, Home, Store } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { api } from '../services/api';
import { useToast } from '../hooks/useToast';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CheckoutModal({ isOpen, onClose, onSuccess }: CheckoutModalProps) {
  const { items, clearCart, getTotalPrice } = useCart();
  const { showToast, ToastComponent } = useToast();
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !phone.trim()) {
      showToast('Por favor, preencha seu nome e telefone', 'error');
      return;
    }

    if (deliveryMethod === 'delivery' && !address.trim()) {
      showToast('Por favor, preencha o endereço de entrega', 'error');
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
        deliveryMethod,
        address: deliveryMethod === 'delivery' ? address.trim() : undefined,
        items: items.map(item => ({
          productId: item.product.id,
          qty: item.quantity
        }))
      };

      const response = await api.createCart(cartData);

      const whatsappNumber = '5598983078865';
      let message = `Olá! Gostaria de fazer o seguinte pedido:\n\n`;
      message += `📦 *Pedido de ${customerName.trim()}*\n\n`;

      // Adicionar cada produto com quantidade e preço
      items.forEach(item => {
        const itemTotal = (item.product.price * item.quantity).toFixed(2).replace('.', ',');
        message += `• ${item.quantity}x ${item.product.name} - R$ ${itemTotal}\n`;
      });

      message += `\n💰 *Total: R$ ${getTotalPrice().toFixed(2).replace('.', ',')}*\n\n`;
      message += `Link completo do pedido:\n${response.link}`;

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

      // Abrir WhatsApp
      window.open(whatsappUrl, '_blank');

      // Limpar carrinho e formulário
      clearCart();
      setCustomerName('');
      setPhone('');
      setNote('');
      setAddress('');
      setDeliveryMethod('delivery');

      showToast('Pedido enviado! Redirecionando para WhatsApp...', 'success');

      // Fechar modal e drawer
      setTimeout(() => {
        onClose();
        onSuccess();
      }, 1000);
    } catch (error) {
      console.error('Erro ao criar carrinho:', error);
      showToast('Erro ao criar pedido. Tente novamente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {ToastComponent}

      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 animate-fade-in"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-[rgb(254,0,0)] to-[rgb(220,0,0)] text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Finalizar Pedido</h2>
                <p className="text-sm text-white/90 mt-1">
                  Total: R$ {getTotalPrice().toFixed(2).replace('.', ',')}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Fechar"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nome Completo *
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

            {/* Método de Entrega */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Método de Entrega *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('delivery')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                    deliveryMethod === 'delivery'
                      ? 'border-[rgb(254,0,0)] bg-red-50 text-[rgb(254,0,0)]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span className="font-semibold">Entrega</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                    deliveryMethod === 'pickup'
                      ? 'border-[rgb(254,0,0)] bg-red-50 text-[rgb(254,0,0)]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Store className="w-5 h-5" />
                  <span className="font-semibold">Retirar</span>
                </button>
              </div>
            </div>

            {/* Campo de Endereço - Apenas para entrega */}
            {deliveryMethod === 'delivery' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Endereço de Entrega *
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(254,0,0)] focus:border-[rgb(254,0,0)] transition-all"
                  placeholder="Rua, número, bairro, cidade"
                  required={deliveryMethod === 'delivery'}
                />
              </div>
            )}

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

            {/* Resumo do Pedido */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Resumo do Pedido</h3>
              <div className="space-y-2">
                {items.slice(0, 3).map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.quantity}x {item.product.name}
                    </span>
                    <span className="font-semibold text-gray-900">
                      R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                ))}
                {items.length > 3 && (
                  <p className="text-xs text-gray-500 italic">
                    + {items.length - 3} {items.length - 3 === 1 ? 'item' : 'itens'}
                  </p>
                )}
              </div>
              <div className="border-t border-gray-300 mt-3 pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-[rgb(254,0,0)]">
                    R$ {getTotalPrice().toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#25D366] text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-[#20ba5a] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-95"
              >
                <MessageCircle className="w-6 h-6" />
                {loading ? 'Enviando...' : 'Enviar o Pedido'}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full text-gray-600 py-3 hover:text-gray-900 transition-colors font-medium"
              >
                Voltar ao Carrinho
              </button>
            </div>

            <p className="text-xs text-center text-gray-500">
              Você será redirecionado para o WhatsApp com o link do seu pedido
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

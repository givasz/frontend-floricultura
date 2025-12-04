import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useState } from 'react';
import CheckoutModal from './CheckoutModal';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const handleCheckout = () => {
    if (items.length === 0) return;
    setShowCheckoutModal(true);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] lg:w-[450px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-gradient-to-r from-[rgb(254,0,0)] to-[rgb(220,0,0)] text-white">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Meu Carrinho</h2>
              <p className="text-sm text-white/90 mt-1">
                {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'itens'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Fechar carrinho"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Carrinho Vazio */}
          {items.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Carrinho Vazio
              </h3>
              <p className="text-gray-600 mb-6">
                Adicione produtos para começar!
              </p>
              <button
                onClick={onClose}
                className="bg-[rgb(254,0,0)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[rgb(220,0,0)] transition-colors"
              >
                Continuar Comprando
              </button>
            </div>
          )}

          {/* Lista de Produtos */}
          {items.length > 0 && (
            <>
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4">
                      {/* Imagem */}
                      <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 pr-2">
                            {item.product.name}
                          </h3>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
                            aria-label="Remover"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-lg font-bold text-[rgb(254,0,0)] mb-3">
                          R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                        </p>

                        {/* Quantidade */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white hover:bg-gray-100 transition-colors border"
                            aria-label="Diminuir"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-bold text-base w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white hover:bg-gray-100 transition-colors border"
                            aria-label="Aumentar"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer com Total e Botão */}
              <div className="border-t bg-white p-4 sm:p-6 space-y-4">
                {/* Total */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
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

                {/* Botão Finalizar */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#25D366] text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-[#20ba5a] transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
                >
                  Finalizar Pedido
                </button>

                <button
                  onClick={onClose}
                  className="w-full text-gray-600 text-sm hover:text-gray-900 transition-colors"
                >
                  Continuar Comprando
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal de Checkout */}
      {showCheckoutModal && (
        <CheckoutModal
          isOpen={showCheckoutModal}
          onClose={() => setShowCheckoutModal(false)}
          onSuccess={onClose}
        />
      )}
    </>
  );
}

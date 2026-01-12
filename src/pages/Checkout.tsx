import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, MessageCircle, Home, Store, CheckCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { api } from '../services/api';
import { useToast } from '../hooks/useToast';
import { PaymentMethodSelector } from '../components/checkout/PaymentMethodSelector';
import { RecipientInfoForm } from '../components/checkout/RecipientInfoForm';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart, getTotalPrice } = useCart();
  const { showToast, ToastComponent } = useToast();

  // Etapa atual (1, 2, 3)
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Etapa 1: Dados do Cliente
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');

  // Etapa 2: Entrega
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('');

  // Etapa 3: Pagamento e Destinatário
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card' | 'debit_card' | 'cash' | ''>('');
  const [needsChange, setNeedsChange] = useState(false);
  const [changeFor, setChangeFor] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');

  // Erros
  const [paymentError, setPaymentError] = useState('');
  const [recipientNameError, setRecipientNameError] = useState('');
  const [recipientPhoneError, setRecipientPhoneError] = useState('');

  // Redirecionar se carrinho vazio
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <CheckCircle className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Carrinho Vazio
            </h2>
            <p className="text-gray-600 mb-8">
              Adicione produtos ao carrinho para continuar
            </p>
            <button
              onClick={() => navigate('/produtos')}
              className="bg-[rgb(254,0,0)] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[rgb(220,0,0)] transition-all"
            >
              Ver Produtos
            </button>
          </div>
        </div>
      </div>
    );
  }

  const validateStep1 = () => {
    if (!customerName.trim()) {
      showToast('Por favor, preencha seu nome', 'error');
      return false;
    }
    if (!phone.trim()) {
      showToast('Por favor, preencha seu telefone', 'error');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (deliveryMethod === 'delivery' && !address.trim()) {
      showToast('Por favor, preencha o endereço de entrega', 'error');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    setPaymentError('');
    setRecipientNameError('');
    setRecipientPhoneError('');

    let hasError = false;

    if (!paymentMethod) {
      setPaymentError('Selecione uma forma de pagamento');
      hasError = true;
    }

    if (!recipientName.trim()) {
      setRecipientNameError('Nome do destinatário é obrigatório');
      hasError = true;
    }

    if (!recipientPhone.trim()) {
      setRecipientPhoneError('Telefone do destinatário é obrigatório');
      hasError = true;
    } else if (recipientPhone.replace(/\D/g, '').length < 11) {
      setRecipientPhoneError('Telefone inválido. Use o formato (11) 91234-5678');
      hasError = true;
    }

    if (paymentMethod === 'cash' && needsChange) {
      const changeValue = parseFloat(changeFor);
      const total = getTotalPrice();
      if (!changeFor || isNaN(changeValue)) {
        showToast('Informe o valor do troco', 'error');
        hasError = true;
      } else if (changeValue < total) {
        showToast(`O valor do troco não pode ser menor que o total (R$ ${total.toFixed(2)})`, 'error');
        hasError = true;
      }
    }

    if (hasError) {
      showToast('Por favor, corrija os erros no formulário', 'error');
    }

    return !hasError;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;

    setLoading(true);

    try {
      // Criar carrinho
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
      console.log('Carrinho criado:', response);

      // Finalizar carrinho
      console.log('Finalizando carrinho com UID:', response.uid);
      await api.finalizeCart(response.uid, {
        paymentMethod: paymentMethod as 'pix' | 'credit_card' | 'debit_card' | 'cash',
        needsChange: paymentMethod === 'cash' ? needsChange : undefined,
        changeFor: paymentMethod === 'cash' && needsChange ? parseFloat(changeFor) : undefined,
        recipientName: recipientName.trim(),
        recipientPhone: recipientPhone.trim()
      });

      // Criar mensagem WhatsApp
      const whatsappNumber = '5598983078865';
      let message = `Olá! Gostaria de fazer o seguinte pedido:\n\n`;
      message += `📦 *Pedido de ${customerName.trim()}*\n\n`;

      items.forEach(item => {
        const itemTotal = (item.product.price * item.quantity).toFixed(2).replace('.', ',');
        message += `• ${item.quantity}x ${item.product.name} - R$ ${itemTotal}\n`;
      });

      message += `\n💰 *Total: R$ ${getTotalPrice().toFixed(2).replace('.', ',')}*\n\n`;
      message += `Link completo do pedido:\n${response.link}`;

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

      // Abrir WhatsApp
      window.open(whatsappUrl, '_blank');

      // Limpar carrinho
      clearCart();

      showToast('Pedido enviado! Redirecionando para WhatsApp...', 'success');

      // Redirecionar para home
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      showToast('Erro ao criar pedido. Tente novamente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      {ToastComponent}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => currentStep === 1 ? navigate('/carrinho') : setCurrentStep(currentStep - 1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>

          <h1 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-2">
            Finalizar Pedido
          </h1>

          {/* Indicador de Etapas */}
          <div className="flex items-center gap-2 mt-6">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`flex-1 h-2 rounded-full transition-all ${
                    step <= currentStep ? 'bg-[rgb(254,0,0)]' : 'bg-gray-300'
                  }`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs sm:text-sm font-medium">
            <span className={currentStep >= 1 ? 'text-[rgb(254,0,0)]' : 'text-gray-500'}>
              Dados
            </span>
            <span className={currentStep >= 2 ? 'text-[rgb(254,0,0)]' : 'text-gray-500'}>
              Entrega
            </span>
            <span className={currentStep >= 3 ? 'text-[rgb(254,0,0)]' : 'text-gray-500'}>
              Pagamento
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
              {/* Etapa 1: Dados do Cliente */}
              {currentStep === 1 && (
                <div className="space-y-5">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                    Seus Dados
                  </h2>

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
                      placeholder="Ex: Entregar até 18h, incluir cartão..."
                    />
                  </div>

                  <button
                    onClick={handleNextStep}
                    className="w-full bg-[rgb(254,0,0)] text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-[rgb(220,0,0)] transition-all flex items-center justify-center gap-2"
                  >
                    Continuar
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Etapa 2: Entrega */}
              {currentStep === 2 && (
                <div className="space-y-5">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                    Método de Entrega
                  </h2>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('delivery')}
                      className={`flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all ${
                        deliveryMethod === 'delivery'
                          ? 'border-[rgb(254,0,0)] bg-red-50 text-[rgb(254,0,0)]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Home className="w-8 h-8" />
                      <span className="font-semibold">Entrega</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('pickup')}
                      className={`flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all ${
                        deliveryMethod === 'pickup'
                          ? 'border-[rgb(254,0,0)] bg-red-50 text-[rgb(254,0,0)]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Store className="w-8 h-8" />
                      <span className="font-semibold">Retirar</span>
                    </button>
                  </div>

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
                      />
                    </div>
                  )}

                  <button
                    onClick={handleNextStep}
                    className="w-full bg-[rgb(254,0,0)] text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-[rgb(220,0,0)] transition-all flex items-center justify-center gap-2"
                  >
                    Continuar
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Etapa 3: Pagamento e Destinatário */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                    Pagamento e Destinatário
                  </h2>

                  <PaymentMethodSelector
                    value={paymentMethod}
                    onChange={(method) => {
                      setPaymentMethod(method);
                      setPaymentError('');
                      if (method !== 'cash') {
                        setNeedsChange(false);
                        setChangeFor('');
                      }
                    }}
                    needsChange={needsChange}
                    onNeedsChangeToggle={setNeedsChange}
                    changeFor={changeFor}
                    onChangeForInput={setChangeFor}
                    cartTotal={getTotalPrice()}
                    error={paymentError}
                  />

                  <div className="border-t border-gray-200 pt-6">
                    <RecipientInfoForm
                      recipientName={recipientName}
                      onRecipientNameChange={(value) => {
                        setRecipientName(value);
                        setRecipientNameError('');
                      }}
                      recipientPhone={recipientPhone}
                      onRecipientPhoneChange={(value) => {
                        setRecipientPhone(value);
                        setRecipientPhoneError('');
                      }}
                      nameError={recipientNameError}
                      phoneError={recipientPhoneError}
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-[#25D366] text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-[#20ba5a] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    <MessageCircle className="w-6 h-6" />
                    {loading ? 'Enviando...' : 'Finalizar Pedido'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Resumo do Pedido
              </h3>

              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.quantity}x R$ {item.product.price.toFixed(2).replace('.', ',')}
                      </p>
                      <p className="text-sm font-bold text-[rgb(254,0,0)]">
                        R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Subtotal:</span>
                  <span className="font-semibold text-gray-900">
                    R$ {getTotalPrice().toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-[rgb(254,0,0)]">
                    R$ {getTotalPrice().toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

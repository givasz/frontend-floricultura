import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingBag, User, Phone, FileText, MessageSquare, Calendar, Home, Store, CreditCard, Banknote, Users, LogOut } from 'lucide-react';
import { api } from '../services/api';
import { Cart } from '../types';
import Loading from '../components/Loading';
import AdminLogin from '../components/admin/AdminLogin';
import { getImageUrl } from '../utils/imageUrl';

export default function CarrinhoPublico() {
  const { uid } = useParams<{ uid: string }>();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Verificar se já está autenticado como admin
  useEffect(() => {
    const credentials = localStorage.getItem('adminCredentials');
    if (credentials) {
      setIsAuthenticated(true);
    }
    setCheckingAuth(false);
  }, []);

  // Buscar carrinho somente após autenticação
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchCart = async () => {
      if (!uid) {
        setError('UID do carrinho não fornecido');
        setLoading(false);
        return;
      }

      try {
        const data = await api.getCartAuth(uid);
        setCart(data);
      } catch (err) {
        console.error('Erro ao buscar carrinho:', err);
        setError('Carrinho não encontrado ou link inválido');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [uid, isAuthenticated]);

  const handleLogin = async (email: string, password: string) => {
    const { adminRoute } = await api.admin.login(email, password);
    const credentials = btoa(`${email}:${password}`);
    localStorage.setItem('adminCredentials', credentials);
    localStorage.setItem('adminRoute', adminRoute);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminCredentials');
    localStorage.removeItem('adminRoute');
    setIsAuthenticated(false);
    setCart(null);
    setLoading(true);
    setError(null);
  };

  // Verificando autenticação
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <Loading />
      </div>
    );
  }

  // Não autenticado - exibir tela de login
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <Loading />
      </div>
    );
  }

  if (error || !cart) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-red-500 mb-4">
              <ShoppingBag className="w-20 h-20 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Carrinho não encontrado
            </h2>
            <p className="text-gray-600 mb-6">
              {error || 'O link do carrinho é inválido ou expirou'}
            </p>
            <a
              href="/"
              className="inline-block bg-[rgb(254,0,0)] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[rgb(220,0,0)] transition-colors"
            >
              Voltar para Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  const total = cart.items.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Botão de Logout */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <ShoppingBag className="w-8 h-8 text-[rgb(254,0,0)]" />
            <h1 className="text-3xl font-bold text-[#1a1a1a]">
              Detalhes do Pedido
            </h1>
          </div>

          {/* Informações do Cliente */}
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">

            {/* Linha 1: Cliente | Telefone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Cliente</p>
                  <p className="font-semibold text-gray-900">{cart.customerName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Telefone</p>
                  <p className="font-semibold text-gray-900">{cart.phone}</p>
                </div>
              </div>
            </div>

            {/* Linha 2: Método de Entrega | Endereço */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                {cart.deliveryMethod === 'delivery' ? (
                  <Home className="w-5 h-5 text-gray-600 mt-0.5 shrink-0" />
                ) : (
                  <Store className="w-5 h-5 text-gray-600 mt-0.5 shrink-0" />
                )}
                <div>
                  <p className="text-sm text-gray-600">Método de Entrega</p>
                  <p className="font-semibold text-gray-900">
                    {cart.deliveryMethod === 'delivery' ? 'Entrega em casa' : 'Retirar no estabelecimento'}
                  </p>
                </div>
              </div>
              {cart.deliveryMethod === 'delivery' && cart.address && (
                <div className="flex items-start gap-3">
                  <Home className="w-5 h-5 text-gray-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Endereço de Entrega</p>
                    <p className="font-semibold text-gray-900">{cart.address}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Observações de Entrega (largura total, só se existir) */}
            {cart.deliveryNote && (
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-gray-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Observações de Entrega</p>
                  <p className="font-semibold text-gray-900 whitespace-pre-wrap">{cart.deliveryNote}</p>
                </div>
              </div>
            )}

            <div className="border-t border-gray-200" />

            {/* Linha 3: Data | Forma de Pagamento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Data do pedido</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(cart.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              {cart.paymentMethod && (
                <div className="flex items-start gap-3">
                  {cart.paymentMethod === 'cash' ? (
                    <Banknote className="w-5 h-5 text-gray-600 mt-0.5 shrink-0" />
                  ) : (
                    <CreditCard className="w-5 h-5 text-gray-600 mt-0.5 shrink-0" />
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Forma de Pagamento</p>
                    <p className="font-semibold text-gray-900">
                      {cart.paymentMethod === 'pix' && 'PIX'}
                      {cart.paymentMethod === 'credit_card' && 'Cartão de Crédito'}
                      {cart.paymentMethod === 'debit_card' && 'Cartão de Débito'}
                      {cart.paymentMethod === 'cash' && 'Dinheiro'}
                    </p>
                    {cart.paymentMethod === 'cash' && cart.needsChange && cart.changeFor && (
                      <p className="text-sm text-gray-600 mt-1">
                        Troco para: <span className="font-semibold text-gray-900">R$ {cart.changeFor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Destinatário (largura total, só se existir) */}
            {cart.recipientName && (
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-gray-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Destinatário</p>
                  <p className="font-semibold text-gray-900">{cart.recipientName}</p>
                  {cart.recipientPhone && (
                    <p className="text-sm text-gray-600 mt-1">{cart.recipientPhone}</p>
                  )}
                </div>
              </div>
            )}

            {/* Mensagem ao Destinatário (largura total, só se existir) */}
            {cart.note && (
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-gray-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Mensagem ao Destinatário</p>
                  <p className="font-semibold text-gray-900 whitespace-pre-wrap">{cart.note}</p>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Itens do Carrinho */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">
            Produtos do Pedido
          </h2>

          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                {/* Imagem */}
                <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={getImageUrl(item.product.imageUrl)}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Informações */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#1a1a1a] mb-1">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {item.product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Quantidade: <span className="font-semibold text-gray-900">{item.qty}</span>
                    </span>
                    <span className="text-sm text-gray-600">
                      Preço unitário: <span className="font-semibold text-gray-900">R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </span>
                  </div>
                </div>

                {/* Total do Item */}
                <div className="flex items-center">
                  <span className="text-xl font-bold text-[rgb(254,0,0)]">
                    R$ {(item.price * item.qty).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex items-center justify-between text-2xl font-bold">
            <span className="text-gray-700">Total do Pedido:</span>
            <span className="text-[rgb(254,0,0)]">
              R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider, useCart } from './contexts/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Produtos from './pages/Produtos';
import CarrinhoPublico from './pages/CarrinhoPublico';
import Checkout from './pages/Checkout';
import PainelAdmin from './pages/PainelAdmin';

function AppContent() {
  const { isDrawerOpen, closeDrawer } = useCart();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/carrinho/:uid" element={<CarrinhoPublico />} />
      </Routes>
      <Footer />
      <WhatsAppButton />
      <CartDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
    </>
  );
}

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="min-h-screen">
          <Routes>
            {/* Rota do Painel Admin (sem navbar/footer padrão) */}
            <Route path="/painel-admin-flor-de-maio" element={<PainelAdmin />} />

            {/* Rotas com Layout Padrão */}
            <Route path="/*" element={<AppContent />} />
          </Routes>
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;

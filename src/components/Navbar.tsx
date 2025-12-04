import { MessageCircle, Menu, X, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getTotalItems, openDrawer } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = location.pathname === '/';

  const scrollToSection = (id: string) => {
    if (!isHomePage) {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Início', id: 'hero', path: '/' },
    { label: 'Sobre', id: 'sobre' },
    { label: 'Produtos', id: 'produtos', path: '/produtos' },
    { label: 'Categorias', id: 'categorias' },
    { label: 'Depoimentos', id: 'depoimentos' }
  ];

  const handleNavClick = (link: typeof navLinks[0]) => {
    if (link.path) {
      navigate(link.path);
      setMobileMenuOpen(false);
    } else {
      scrollToSection(link.id);
    }
  };

  const totalItems = getTotalItems();

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHomePage
          ? 'bg-white/95 backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.1)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[70px] lg:h-[80px]">
          <Link to="/">
            <img
              src="https://storage.lucasmendes.dev/site-sp/giovannaflores%2Fflor%20de%20maio%203.png"
              alt="Flor de Maio"
              className="h-[45px] lg:h-[60px] w-auto cursor-pointer"
            />
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link)}
                className={`font-medium transition-colors hover:text-[var(--vermelho)] ${
                  scrolled || !isHomePage ? 'text-[var(--texto-escuro)]' : 'text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {/* Carrinho */}
            <button
              onClick={openDrawer}
              className={`relative p-2 transition-colors ${
                scrolled || !isHomePage ? 'text-[var(--texto-escuro)]' : 'text-white'
              } hover:text-[var(--vermelho)]`}
              aria-label="Abrir carrinho"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[var(--vermelho)] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            <a
              href="https://wa.me/5598983078865"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-[var(--whatsapp)] text-white w-10 h-10 lg:w-12 lg:h-12 rounded-full font-semibold hover:opacity-90 transition-all hover:scale-105 shadow-lg"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-5 h-5 lg:w-6 lg:h-6" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 transition-colors ${
                scrolled || !isHomePage ? 'text-[var(--texto-escuro)]' : 'text-white'
              }`}
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-md border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link)}
                className="block w-full text-left py-3 px-4 text-[var(--texto-escuro)] font-medium hover:bg-gray-50 hover:text-[var(--vermelho)] rounded-lg transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

import { ShoppingBag, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
    <section className="bg-gradient-to-b from-[var(--vermelho)] to-[var(--vermelho-escuro)] py-20 lg:py-32 px-6 lg:px-8 text-center text-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 leading-tight">
          Pronto Para Surpreender Alguém Especial?
        </h2>

        <p className="text-lg lg:text-2xl mb-10 lg:mb-12 opacity-95 max-w-3xl mx-auto">
          Entregamos no mesmo dia em toda São Luís e região. Escolha entre mais de 500 produtos ou faça seu pedido personalizado.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Link
            to="/produtos"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-[var(--vermelho)] px-10 lg:px-12 py-5 lg:py-6 rounded-xl font-bold text-lg hover:scale-105 transition-transform"
          >
            <ShoppingBag className="w-5 h-5" />
            Ver Catálogo Completo
          </Link>

          <a
            href="https://wa.me/5598983078865"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[var(--whatsapp)] text-white px-10 lg:px-12 py-5 lg:py-6 rounded-xl font-bold text-lg hover:scale-105 transition-transform"
          >
            <MessageCircle className="w-5 h-5" />
            Fazer Pedido Personalizado
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 lg:gap-6 text-base lg:text-lg opacity-90">
          <span>✓ Entrega no Mesmo Dia</span>
          <span className="hidden sm:inline">|</span>
          <span>✓ 39 Anos de Tradição</span>
          <span className="hidden sm:inline">|</span>
          <span>✓ +500 Produtos</span>
        </div>
      </div>
    </section>
  );
}

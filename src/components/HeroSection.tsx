import { ShoppingBag, MessageCircle } from 'lucide-react';

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-[85vh] sm:min-h-[90vh] lg:min-h-screen flex items-center justify-center text-white overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://storage.lucasmendes.dev/site-sp/giovannaflores%2Fhero2.webp)',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center space-y-6 sm:space-y-8">
          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] animate-fade-in-up">
            40 Anos Encantando São Luís<br className="hidden sm:block" /> com Flores Naturais
          </h1>
          
          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed max-w-3xl mx-auto opacity-95">
            A floricultura mais tradicional de São Luís. Entrega rápida no mesmo dia, de domingo a domingo.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center pt-4">
            
              <a href="https://giovannaflores.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2.5 bg-[rgb(254,0,0)] text-white px-7 sm:px-9 lg:px-11 py-3.5 sm:py-4 lg:py-[1.125rem] rounded-full font-semibold text-base lg:text-lg shadow-[0_8px_24px_rgba(254,0,0,0.4)] hover:bg-[rgb(220,0,0)] hover:shadow-[0_12px_32px_rgba(254,0,0,0.5)] hover:scale-105 transition-all duration-300"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Ver Todos os Produtos
            </a>
            
            
              <a href="https://wa.me/5598983078865?text=Olá!%20Vim%20do%20site%20e%20gostaria%20de%20fazer%20um%20pedido"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2.5 bg-[#25D366] text-white px-7 sm:px-9 lg:px-11 py-3.5 sm:py-4 lg:py-[1.125rem] rounded-full font-semibold text-base lg:text-lg shadow-[0_8px_24px_rgba(37,211,102,0.4)] hover:bg-[#22c55e] hover:shadow-[0_12px_32px_rgba(37,211,102,0.5)] hover:scale-105 transition-all duration-300"
            >
              <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Fazer Pedido no WhatsApp
            </a>
          </div>
          
          {/* Trust Badge */}
          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 lg:gap-6 bg-white/95 backdrop-blur-sm text-[#1a1a1a] px-5 sm:px-6 lg:px-8 py-3 sm:py-3.5 lg:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm lg:text-base font-medium shadow-lg">
            <div className="flex items-center gap-3 sm:gap-6">
              <span className="flex items-center gap-1.5">
                <span className="text-[rgb(254,0,0)] font-bold">✓</span>
                Desde 1986
              </span>
              <span className="hidden sm:inline text-gray-300">|</span>
              <span className="flex items-center gap-1.5">
                <span className="text-[rgb(254,0,0)] font-bold">✓</span>
                Entrega no Mesmo Dia
              </span>
            </div>
            <div className="flex items-center">
              <span className="hidden sm:inline text-gray-300 mr-3 lg:mr-6">|</span>
              <span className="flex items-center gap-1.5">
                <span className="text-[rgb(254,0,0)] font-bold">✓</span>
                Aberto Domingo
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator (opcional) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden lg:block">
        <svg 
          className="w-6 h-6 text-white/70" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
}
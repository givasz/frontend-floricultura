import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/5598983078865?text=Olá!%20Vim%20do%20site%20e%20gostaria%20de%20fazer%20um%20pedido"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 w-[60px] h-[60px] bg-[var(--whatsapp)] rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform animate-pulse-custom"
      aria-label="WhatsApp"
    >
      <MessageCircle className="w-8 h-8 text-white" />
    </a>
  );
}

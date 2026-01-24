import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          <div>
            <img
              src="https://storage.lucasmendes.dev/site-sp/giovannaflores%2Flogo.png"
              alt="Flor de Maio"
              className="h-16 w-auto mb-4"
            />
            <p className="text-gray-400 mb-4 leading-relaxed">
              A floricultura mais tradicional de São Luís desde 1986
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/floriculturaflordemaio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contato</h3>
            <div className="space-y-3">
              <a
                href="https://wa.me/5598983078865"
                className="flex items-start gap-3 text-gray-400 hover:text-white transition-colors"
              >
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>(98) 98307-8865</span>
              </a>
              <a
                href="https://wa.me/5598985908178"
                className="flex items-start gap-3 text-gray-400 hover:text-white transition-colors"
              >
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>(98) 98590-8178</span>
              </a>
              <a
                href="mailto:Flordemaiofloriculturas@hotmail.com"
                className="flex items-start gap-3 text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span className="break-all">Flordemaiofloriculturas@hotmail.com</span>
              </a>
              <a
                href="mailto:Giovannasalgueiroaguiar@gmail.com"
                className="flex items-start gap-3 text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span className="break-all">Giovannasalgueiroaguiar@gmail.com</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Localização</h3>
            <div className="flex items-start gap-3 text-gray-400">
              <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p>Av. Daniel de La Touche, Nº 10-B</p>
                <p>Cohama - São Luís/MA</p>
                <p>CEP: 65074-115</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Horário de Funcionamento</h3>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">Segunda a Sexta</p>
                  <p>7h às 20h</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">Sábado</p>
                  <p>7h às 20h</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">Domingo</p>
                  <p>8h às 13h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0f0f0f] py-6 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-gray-400 text-sm">
          <p>© 2025 Flor de Maio Floricultura. Todos os direitos reservados. CNPJ: 38.077.453/0001-99</p>
        </div>
      </div>
    </footer>
  );
}

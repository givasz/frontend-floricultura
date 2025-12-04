export default function TestimonialsSection() {
  const testimonials = [
    {
      stars: 5,
      text: 'Compro na Flor de Maio há mais de 10 anos e nunca me decepcionei. A qualidade das flores é excepcional e a entrega sempre pontual!',
      name: 'Maria Silva',
      location: 'Renascença, São Luís'
    },
    {
      stars: 5,
      text: 'Precisei de um arranjo urgente e eles entregaram no mesmo dia, impecável! A floricultura mais confiável de São Luís!',
      name: 'João Santos',
      location: 'Cohama, São Luís'
    },
    {
      stars: 5,
      text: '39 anos de tradição fazem toda a diferença. O atendimento é excelente e os produtos são lindos e de qualidade!',
      name: 'Ana Costa',
      location: 'Calhau, São Luís'
    }
  ];

  return (
    <section id="depoimentos" className="bg-white py-16 lg:py-28 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl lg:text-5xl font-bold text-center text-[var(--texto-escuro)] mb-12 lg:mb-16">
          Milhares de Clientes Satisfeitos em 39 Anos
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-[var(--cinza-claro)] rounded-[20px] p-8 lg:p-10 border-l-4 border-[var(--vermelho)] hover:-translate-y-2 transition-all duration-300"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.stars)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">⭐</span>
                ))}
              </div>

              <p className="text-[var(--texto-medio)] text-lg leading-relaxed mb-6">
                "{testimonial.text}"
              </p>

              <div className="border-t border-gray-300 pt-4">
                <p className="font-bold text-[var(--texto-escuro)]">
                  {testimonial.name}
                </p>
                <p className="text-[var(--texto-medio)] text-sm">
                  {testimonial.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

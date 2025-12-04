export default function BenefitsBar() {
  const benefits = [
    {
      icon: '🏆',
      title: '39 Anos de Tradição',
      text: 'A floricultura mais antiga de São Luís em atividade'
    },
    {
      icon: '🚚',
      title: 'Entrega Expressa',
      text: 'Entregamos no mesmo dia em toda São Luís e região'
    },
    {
      icon: '💐',
      title: 'Flores Premium',
      text: 'Flores naturais selecionadas com qualidade garantida'
    },
    {
      icon: '💝',
      title: 'Presentes Especiais',
      text: 'Flores, pelúcias, chocolates, cestas e muito mais'
    }
  ];

  return (
    <section className="bg-white py-12 lg:py-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white border-2 border-gray-100 rounded-[20px] p-8 lg:p-10 text-center hover:-translate-y-2 hover:border-[var(--vermelho)] transition-all duration-300"
            >
              <div className="text-5xl lg:text-6xl mb-4 text-[var(--vermelho)]">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-[var(--texto-escuro)]">
                {benefit.title}
              </h3>
              <p className="text-[var(--texto-medio)] leading-relaxed">
                {benefit.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function DifferentialsSection() {
  const differentials = [
    {
      type: 'number',
      value: '40',
      label: 'Anos de Tradição',
      text: 'A floricultura em atividade mais antiga de São Luís'
    },
    {
      type: 'number',
      value: '7/7',
      label: 'Dias por Semana',
      text: 'Funcionamos e entregamos todos os dias, inclusive domingos'
    },
    {
      type: 'icon',
      icon: '⚡',
      label: 'Entrega no Mesmo Dia',
      text: 'Entregas rápidas em toda São Luís e região'
    },
    {
      type: 'icon',
      icon: '💯',
      label: 'Qualidade Premium',
      text: 'Flores naturais selecionadas e presentes de alta qualidade'
    },
    {
      type: 'icon',
      icon: '💰',
      label: 'Preço Justo',
      text: 'Melhor custo-benefício sem comprometer a qualidade'
    },
    {
      type: 'icon',
      icon: '📍',
      label: 'Cobertura Completa',
      text: 'Atendemos em toda São Luís, Raposa, Paço do Lumiar e São José de Ribamar'
    }
  ];

  return (
    <section className="bg-gradient-to-b from-white to-[#ffe5e5] py-16 lg:py-28 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl lg:text-5xl font-bold text-center text-[var(--texto-escuro)] mb-12 lg:mb-16">
          Por Que Somos a Floricultura Mais Escolhida de São Luís?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {differentials.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-[20px] p-10 lg:p-12 text-center border-2 border-transparent hover:-translate-y-3 hover:border-[var(--vermelho)] transition-all duration-300"
            >
              {item.type === 'number' ? (
                <div className="text-6xl lg:text-7xl font-bold text-[var(--vermelho)] mb-4">
                  {item.value}
                </div>
              ) : (
                <div className="text-6xl lg:text-7xl mb-4">
                  {item.icon}
                </div>
              )}

              <h3 className="text-xl font-bold text-[var(--texto-escuro)] mb-3">
                {item.label}
              </h3>

              <p className="text-[var(--texto-medio)] leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

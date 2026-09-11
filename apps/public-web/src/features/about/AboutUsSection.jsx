const milestones = [
  {
    period: 'Primera década de 2000',
    title: 'Experiencias nacidas en las regiones',
    description: 'Las asesorías regionales de Matemáticas impulsaron olimpiadas locales. Entre las experiencias pioneras se encuentra la desarrollada en la Dirección Regional de Educación de Puriscal.',
  },
  {
    period: '2014',
    title: 'Proyección nacional',
    description: 'La Asesoría Nacional de Matemáticas de la Dirección de Desarrollo Curricular del MEP acogió las iniciativas regionales para proyectarlas a escala nacional.',
  },
  {
    period: '2015',
    title: 'Nacimiento oficial de OLCOMEP',
    description: 'La olimpiada inició oficialmente para estudiantes de I y II Ciclos, con una estructura piloto gestionada por las asesorías del MEP y centrada en la resolución de problemas en contextos reales.',
  },
  {
    period: '2020',
    title: 'Resiliencia y apertura digital',
    description: 'Durante la pandemia se virtualizaron etapas formativas y eliminatorias, ampliando el uso de tecnologías de la información dentro del proceso olímpico.',
  },
  {
    period: '2022–2024',
    title: 'Crecimiento y alcance territorial',
    description: 'La participación aumentó un 120 %, al pasar de 7 000 a más de 18 000 estudiantes inscritos. Las 27 Direcciones Regionales de Educación se incorporaron activamente al proceso.',
  },
  {
    period: 'Actualidad',
    title: 'Alianza interinstitucional',
    description: 'UCR, UNED, UNA, TEC y UTN aportan respaldo técnico, científico y metodológico junto con la experiencia pedagógica de las asesorías del MEP en la Comisión Central.',
  },
]

export function AboutUsSection() {
  return (
    <section id="acerca-de-nosotros" className="scroll-mt-28 bg-brand-soft py-16 sm:py-20" aria-labelledby="titulo-acerca-de-nosotros">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="eyebrow text-brand-primary">Nuestra historia</p>
            <h2 id="titulo-acerca-de-nosotros" className="section-title mt-3">Acerca de nosotros</h2>
            <div className="mt-6 max-w-xl space-y-5 text-lg leading-8 text-slate-700">
              <p>OLCOMEP surgió del trabajo desarrollado en las aulas y del liderazgo de las regiones educativas, que reconocieron el talento y entusiasmo de la niñez costarricense por la matemática.</p>
              <p>Desde 2015, el Ministerio de Educación Pública conduce esta iniciativa nacional para estudiantes de primero a sexto año, articulando la experiencia de sus asesorías con el aporte de la educación superior pública.</p>
            </div>
          </div>

          <ol className="border-y border-brand-primary/20">
            {milestones.map(({ description, period, title }) => (
              <li className="grid gap-2 border-b border-brand-primary/20 py-6 last:border-b-0 sm:grid-cols-[9rem_1fr] sm:gap-6" key={period}>
                <p className="font-black text-brand-primary">{period}</p>
                <div>
                  <h3 className="text-xl font-black text-slate-900">{title}</h3>
                  <p className="mt-2 leading-7 text-slate-700">{description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-12 border-t-4 border-brand-highlight pt-8 lg:grid lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <h3 className="text-2xl font-black text-slate-900">Una visión integral y humanista</h3>
          <div className="mt-4 space-y-4 leading-7 text-slate-700 lg:mt-0">
            <p>OLCOMEP trasciende la competencia académica: promueve habilidades vinculadas con el enfoque STEAM, la equidad de género, el pensamiento crítico y la superación personal en un entorno sano e inclusivo.</p>
            <p>Mediante etapas de participación, materiales didácticos de acceso universal y acompañamiento a docentes y familias, busca que cada niña y niño encuentre en la matemática una oportunidad para desarrollar creatividad, lógica y confianza en sus capacidades.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

const collaborators = [
  {
    name: 'Universidad de Costa Rica',
    logo: '/logo-ucr.png',
    width: 500,
    height: 500,
  },
  {
    name: 'Universidad Estatal a Distancia',
    logo: '/logo-uned.png',
    width: 521,
    height: 500,
  },
  {
    name: 'Universidad Nacional',
    logo: '/logo-una.png',
    width: 500,
    height: 500,
  },
  {
    name: 'Tecnológico de Costa Rica',
    logo: '/logo-tec.png',
    width: 521,
    height: 500,
  },
  {
    name: 'Universidad Técnica Nacional',
    logo: '/logo-utn.png',
    width: 521,
    height: 500,
  },
]

export function PartnersSection() {
  return (
    <section id="colaboradores-patrocinadores" className="scroll-mt-28 border-b border-line py-16 sm:py-20" aria-labelledby="titulo-colaboradores">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <div>
            <p className="eyebrow text-brand-primary">Alianza interinstitucional</p>
            <h2 id="titulo-colaboradores" className="section-title mt-3">Colaboradores y patrocinadores</h2>
          </div>
          <p className="max-w-3xl text-lg leading-8 text-slate-700">OLCOMEP articula la experiencia pedagógica del Ministerio de Educación Pública con el aporte de las universidades públicas y el respaldo de organizaciones que apoyan la edición vigente.</p>
        </div>

        <div className="mt-12" aria-labelledby="titulo-instituciones-colaboradoras">
          <div className="flex flex-col gap-2 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
            <h3 id="titulo-instituciones-colaboradoras" className="text-2xl font-black text-slate-900">Universidades públicas colaboradoras</h3>
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand-primary">Comisión Central OLCOMEP</p>
          </div>

          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-6" aria-label="Instituciones colaboradoras">
            {collaborators.map(({ height, logo, name, width }) => (
              <li className="group flex min-h-48 items-center justify-center px-3 py-5" key={name}>
                <img alt={`Logotipo de ${name}`} className="h-32 w-full object-contain sm:h-36 lg:h-32 xl:h-36 motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-safe:group-hover:scale-[1.06]" height={height} loading="lazy" src={logo} width={width} />
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 grid gap-6 border-l-4 border-brand-highlight bg-slate-50 px-6 py-7 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16" aria-labelledby="titulo-patrocinador">
          <div>
            <p className="eyebrow text-brand-primary">Patrocinador</p>
            <h3 id="titulo-patrocinador" className="mt-3 text-2xl font-black text-slate-900">Centro Cultural Costarricense Norteamericano</h3>
          </div>
          <p className="self-center leading-7 text-slate-700">Organización patrocinadora de OLCOMEP 2026. Su reconocimiento se presenta de forma textual mientras no se disponga de un logotipo oficial autorizado para publicación.</p>
        </div>
      </div>
    </section>
  )
}

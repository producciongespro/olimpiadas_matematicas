import { CalendarDays, ExternalLink } from 'lucide-react'

const schedule = [
  {
    date: '8 de abril al 6 de mayo',
    dateTime: '2026-04-08',
    endDateTime: '2026-05-06',
    title: 'Inscripción',
    description: 'Periodo oficial de inscripción mediante el formulario o instrumento habilitado para la edición 2026.',
  },
  {
    date: 'Mayo',
    dateTime: '2026-05',
    title: 'Actividades de inauguración',
    description: 'Las actividades de apertura se desarrollan durante todo el mes.',
  },
  {
    date: 'Mayo',
    dateTime: '2026-05',
    title: 'Talleres de preparación para la Primera Etapa',
    description: 'La fecha y hora específicas se comunican en el sitio web, redes oficiales y comunicados del MEP.',
  },
  {
    date: '16 al 18 de junio',
    dateTime: '2026-06-16',
    endDateTime: '2026-06-18',
    title: 'Pruebas de aplicación de la Primera Etapa',
    description: 'Día 1: quinto y sexto año. Día 2: tercero y cuarto año. Día 3: primero y segundo año. Modalidad presencial en los centros educativos participantes.',
  },
  {
    date: '5 de julio',
    dateTime: '2026-07-05',
    title: 'Resultados para la Segunda Etapa',
    description: 'Publicación de personas clasificadas mediante las asesorías regionales de Matemáticas y la página social oficial.',
  },
  {
    date: 'Julio',
    dateTime: '2026-07',
    title: 'Talleres de preparación para la Segunda Etapa',
    description: 'La programación específica se anuncia mediante los canales oficiales de OLCOMEP y el MEP.',
  },
  {
    date: '18 al 20 de agosto',
    dateTime: '2026-08-18',
    endDateTime: '2026-08-20',
    title: 'Pruebas de aplicación de la Segunda Etapa',
    description: 'Día 1: quinto y sexto año. Día 2: tercero y cuarto año. Día 3: primero y segundo año. Modalidad presencial en sedes de las Direcciones Regionales de Educación.',
  },
  {
    date: '7 de setiembre',
    dateTime: '2026-09-07',
    title: 'Resultados para la Final Nacional',
    description: 'Publicación de personas clasificadas mediante las asesorías regionales y la página social oficial.',
  },
  {
    date: 'Septiembre',
    dateTime: '2026-09',
    title: 'Talleres de preparación para la Etapa Final',
    description: 'La fecha y hora específicas se informan por los canales oficiales.',
  },
  {
    date: '8 de octubre',
    dateTime: '2026-10-08',
    title: 'Etapa Final',
    description: 'Aplicación presencial en una sede única de cada Dirección Regional de Educación.',
    highlighted: true,
  },
  {
    date: '6 de noviembre',
    dateTime: '2026-11-06',
    title: 'Resultados de medallistas y personas galardonadas',
    description: 'Comunicación mediante las asesorías regionales de Matemáticas y la página social oficial.',
  },
  {
    date: '3 de diciembre',
    dateTime: '2026-12-03',
    title: 'Premiación Nacional',
    description: 'La información de participación se brinda directamente a los centros educativos.',
    highlighted: true,
  },
]

function ScheduleDate({ date, dateTime, endDateTime }) {
  if (!endDateTime) return <time dateTime={dateTime}>{date}</time>

  const [startLabel, endLabel] = date.split(' al ')
  return (
    <>
      <time dateTime={dateTime}>{startLabel}</time>
      {' al '}
      <time dateTime={endDateTime}>{endLabel}</time>
    </>
  )
}

export function CalendarSection() {
  return (
    <section id="calendario" className="scroll-mt-28 border-b border-line bg-slate-50 py-16 sm:py-20" aria-labelledby="titulo-calendario">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <div className="grid gap-8 border-b border-line pb-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <div>
            <p className="eyebrow text-brand-primary">XII edición · 2026</p>
            <h2 id="titulo-calendario" className="section-title mt-3">Calendario</h2>
          </div>
          <div>
            <p className="max-w-3xl text-lg leading-8 text-slate-700">Consulte las fechas oficiales de inscripción, preparación, aplicación de pruebas, publicación de resultados y premiación de OLCOMEP 2026.</p>
            <p className="mt-3 leading-7 text-slate-600">Las fechas y horas específicas de los talleres se comunicarán mediante los canales oficiales.</p>
          </div>
        </div>

        <ol className="relative mt-10 grid gap-0 lg:grid-cols-2 lg:gap-x-12" aria-label="Cronograma OLCOMEP 2026">
          {schedule.map(({ date, dateTime, description, endDateTime, highlighted, title }, index) => (
            <li className={`relative grid grid-cols-[4rem_1fr] gap-4 border-t border-line py-6 sm:grid-cols-[7.5rem_1fr] ${highlighted ? 'bg-brand-highlight/10' : ''}`} key={`${date}-${title}`}>
              <span className="pl-3 text-xs font-black tabular-nums text-brand-primary/60 sm:pl-4">{String(index + 1).padStart(2, '0')}</span>
              <div className="pr-3 sm:pr-5">
                <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.06em] text-brand-primary">
                  <CalendarDays aria-hidden="true" size={18} />
                  <ScheduleDate date={date} dateTime={dateTime} endDateTime={endDateTime} />
                </p>
                <h3 className="mt-2 text-xl font-black leading-tight text-slate-900">{title}</h3>
                <p className="mt-2 leading-7 text-slate-600">{description}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col gap-4 border-l-4 border-brand-highlight bg-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-3xl leading-7 text-slate-700">Este calendario resume el cronograma oficial. Consulte el manual para conocer las observaciones y condiciones completas de cada etapa.</p>
          <a className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-lg bg-brand-primary px-5 py-3 font-bold text-white hover:bg-brand-primary/90" href="/data/2026/manual-OLCOMEP-primaria-2026.pdf" rel="noopener noreferrer" target="_blank">
            Abrir manual 2026 <ExternalLink aria-hidden="true" size={18} />
          </a>
        </div>
      </div>
    </section>
  )
}

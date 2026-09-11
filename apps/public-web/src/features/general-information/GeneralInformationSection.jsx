import { CalendarDays, ChevronDown, FileText, HelpCircle, UsersRound } from 'lucide-react'

const informationRoutes = [
  {
    description: 'Normas, condiciones y disposiciones oficiales para la edición OLCOMEP 2026.',
    href: '/data/2026/reglamento-OLCOMEP-2026.pdf',
    icon: FileText,
    label: 'Abrir reglamento 2026 en PDF',
    title: 'Reglamento',
    external: true,
  },
  {
    description: 'Participación dirigida a estudiantes de primero a sexto año de Educación Primaria mediante el proceso oficial de inscripción.',
    href: '#edicion-vigente',
    icon: UsersRound,
    label: 'Consultar cómo participar en la edición vigente',
    title: 'Cómo participar',
  },
  {
    description: 'El periodo de inscripción publicado para 2026 estuvo habilitado del 8 de abril al 6 de mayo.',
    href: '/data/2026/manual-OLCOMEP-primaria-2026.pdf',
    icon: CalendarDays,
    label: 'Abrir el manual 2026 con la información de la edición',
    title: 'Calendario',
    external: true,
  },
  {
    description: 'Respuestas rápidas sobre población participante, inscripción, preparación y consultas regionales.',
    href: '#preguntas-frecuentes',
    icon: HelpCircle,
    label: 'Ir a preguntas frecuentes de OLCOMEP',
    title: 'Preguntas frecuentes',
  },
]

const frequentlyAskedQuestions = [
  {
    question: '¿Quiénes pueden participar?',
    answer: 'Estudiantes de primero a sexto año diurno de la Educación General Básica de Costa Rica, de acuerdo con las condiciones establecidas para cada edición.',
  },
  {
    question: '¿Cómo se realiza la inscripción?',
    answer: 'La inscripción continúa mediante el formulario oficial externo. El periodo correspondiente a 2026 estuvo habilitado del 8 de abril al 6 de mayo y actualmente se encuentra cerrado.',
  },
  {
    question: '¿Dónde se encuentran los materiales de preparación?',
    answer: 'La sección Práctica por nivel reúne cuadernillos para estudiantes y docentes, recursos históricos y actividades interactivas disponibles.',
  },
  {
    question: '¿Dónde puedo hacer una consulta regional?',
    answer: 'La sección Coordinaciones regionales permite buscar la Dirección Regional de Educación correspondiente y consultar sus correos institucionales publicados.',
  },
]

export function GeneralInformationSection() {
  return (
    <section id="informacion-general" className="scroll-mt-28 border-b border-line py-16 sm:py-20" aria-labelledby="titulo-informacion-general">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-16">
          <div>
            <p className="eyebrow text-brand-primary">Orientación para participar</p>
            <h2 id="titulo-informacion-general" className="section-title mt-3">Información general</h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-700">Encuentre los documentos, fechas y recorridos principales para conocer y participar en OLCOMEP.</p>
          </div>

          <nav aria-label="Temas de información general">
            <ol className="border-y border-line">
              {informationRoutes.map(({ description, external, href, icon: Icon, label, title }, index) => (
                <li className="border-b border-line last:border-b-0" key={title}>
                  <a className="group grid min-h-32 grid-cols-[auto_1fr_auto] items-center gap-4 py-5" href={href} aria-label={label} {...(external ? { rel: 'noopener noreferrer', target: '_blank' } : {})}>
                    <span className="text-sm font-black text-brand-primary/60">{String(index + 1).padStart(2, '0')}</span>
                    <span>
                      <span className="flex items-center gap-3 text-xl font-black text-slate-900 group-hover:text-brand-primary"><Icon aria-hidden="true" className="shrink-0 text-brand-primary" size={22} />{title}</span>
                      <span className="mt-2 block max-w-2xl leading-7 text-slate-600">{description}</span>
                    </span>
                    <span aria-hidden="true" className="text-2xl text-brand-primary">→</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <div id="preguntas-frecuentes" className="mt-14 scroll-mt-28 border-t-4 border-brand-highlight pt-8">
          <div className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr] lg:gap-16">
            <div>
              <p className="eyebrow text-brand-primary">Respuestas rápidas</p>
              <h3 className="mt-3 text-2xl font-black text-slate-900">Preguntas frecuentes</h3>
            </div>
            <div className="divide-y divide-line border-y border-line">
              {frequentlyAskedQuestions.map(({ answer, question }) => (
                <details className="group py-5" key={question}>
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-black text-slate-900 marker:hidden">
                    {question}<ChevronDown aria-hidden="true" className="shrink-0 text-brand-primary transition-transform group-open:rotate-180 motion-reduce:transition-none" size={21} />
                  </summary>
                  <p className="max-w-3xl pb-2 pr-10 leading-7 text-slate-700">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

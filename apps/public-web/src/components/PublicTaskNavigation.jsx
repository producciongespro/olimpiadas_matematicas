import { ArrowUpRight, BookOpen, CalendarDays, FileText, MapPinned } from 'lucide-react'

const destinations = [
  { href: '#edicion-vigente', label: 'Edición vigente', detail: 'Inscripción y documentos oficiales', Icon: FileText },
  { href: '#cuadernillos', label: 'Cuadernillos', detail: 'Materiales para practicar por nivel', Icon: BookOpen },
  { href: '#calendario', label: 'Calendario', detail: 'Fechas y etapas de la olimpiada', Icon: CalendarDays },
  { href: '#coordinaciones-regionales', label: 'Coordinaciones', detail: 'Contactos en las regiones educativas', Icon: MapPinned },
]

export function PublicTaskNavigation() {
  return <nav aria-label="Accesos principales" className="border-b border-brand-primary/20 bg-white py-9 sm:py-11">
    <div className="mx-auto max-w-content px-5 sm:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow text-brand-accent">Explore OLCOMEP</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-brand-primary sm:text-3xl">¿Qué necesita consultar?</h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-slate-600">Acceda directamente a los recursos y la información de la olimpiada.</p>
      </div>
      <ul className="grid gap-px overflow-hidden rounded-xl border border-brand-primary/15 bg-brand-primary/15 sm:grid-cols-2 xl:grid-cols-4">
        {destinations.map(({ href, label, detail, Icon }) => <li className="bg-brand-soft" key={href}>
          <a className="group flex min-h-32 items-start gap-4 p-5 text-brand-primary transition-colors duration-150 hover:bg-white motion-reduce:transition-none sm:p-6" href={href}>
            <Icon aria-hidden="true" className="mt-1 shrink-0 text-brand-accent" size={25} strokeWidth={1.8} />
            <span className="min-w-0 flex-1">
              <strong className="block text-lg font-black leading-6">{label}</strong>
              <span className="mt-2 block text-sm leading-5 text-slate-600">{detail}</span>
            </span>
            <ArrowUpRight aria-hidden="true" className="shrink-0 opacity-70 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" size={18} />
          </a>
        </li>)}
      </ul>
    </div>
  </nav>
}

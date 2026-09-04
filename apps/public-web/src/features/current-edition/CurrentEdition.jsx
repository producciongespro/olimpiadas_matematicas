import { CalendarX, Download, ExternalLink, FileArchive, FileSpreadsheet, FileText } from 'lucide-react'

const resources = [
  { description: 'Orientaciones oficiales para participar en la edición vigente.', format: 'PDF', href: '/data/2026/manual-OLCOMEP-primaria-2026.pdf', icon: FileText, title: 'Manual OLCOMEP Primaria 2026' },
  { description: 'Normas, condiciones y disposiciones de la Olimpiada 2026.', format: 'PDF', href: '/data/2026/reglamento-OLCOMEP-2026.pdf', icon: FileText, title: 'Reglamento OLCOMEP 2026' },
  { description: 'Colección disponible en el sitio anterior, publicada en 2025.', format: 'ZIP · edición 2025', href: '/data/2025/temarios.zip', icon: FileArchive, title: 'Temarios disponibles' },
  { description: 'Protocolo disponible actualmente como referencia para la organización.', format: 'PDF · edición 2024', href: '/data/2024/protocolo-2024.pdf', icon: FileText, title: 'Protocolo de aplicación' },
]

export function CurrentEdition() {
  return (
    <section id="edicion-vigente" className="scroll-mt-28 bg-brand-soft py-16 sm:py-20" aria-labelledby="titulo-edicion">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="eyebrow text-brand-primary">Información actual</p>
            <h2 id="titulo-edicion" className="section-title mt-3">Edición OLCOMEP 2026</h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-700">Consulte los documentos oficiales y materiales disponibles para estudiantes, familias y personal docente.</p>
            <aside className="mt-8 border-l-4 border-brand-highlight bg-white px-5 py-5" aria-labelledby="estado-inscripcion">
              <div className="flex gap-4">
                <CalendarX aria-hidden="true" className="mt-1 shrink-0 text-brand-primary" />
                <div>
                  <h3 id="estado-inscripcion" className="font-black text-slate-900">Inscripción 2026 cerrada</h3>
                  <p className="mt-1 leading-7 text-slate-600">El periodo de inscripción estuvo habilitado del 8 de abril al 6 de mayo de 2026.</p>
                  <a className="mt-3 inline-flex items-center gap-2 font-bold text-brand-primary underline decoration-2 underline-offset-4 hover:text-brand-accent" href="https://forms.gle/QStuNgoiQCtoDMfD9" rel="noopener noreferrer" target="_blank">
                    Consultar formulario histórico <ExternalLink aria-hidden="true" size={17} />
                  </a>
                </div>
              </div>
            </aside>
          </div>

          <div className="overflow-hidden rounded-xl border border-line bg-white">
            <h3 className="sr-only">Documentos de la edición</h3>
            <ul className="divide-y divide-line">
              {resources.map(({ description, format, href, icon: Icon, title }) => (
                <li className="group" key={href}>
                  <a className="grid min-h-28 grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-5 hover:bg-brand-soft sm:px-6" href={href} rel="noopener noreferrer" target="_blank">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-soft text-brand-primary group-hover:bg-white"><Icon aria-hidden="true" /></span>
                    <span>
                      <span className="block font-black text-slate-900">{title}</span>
                      <span className="mt-1 block text-sm leading-6 text-slate-600">{description}</span>
                      <span className="mt-2 block text-xs font-bold uppercase tracking-wider text-brand-accent">{format}</span>
                    </span>
                    <Download aria-hidden="true" className="text-brand-primary" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 grid items-center gap-8 border-t border-brand-primary/20 pt-10 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <p className="eyebrow text-brand-primary">Inscripción masiva</p>
            <h3 className="mt-3 text-2xl font-black text-slate-900">Plantilla para centros educativos</h3>
            <p className="mt-3 max-w-2xl leading-7 text-slate-700">Descargue el archivo oficial de inscripción masiva correspondiente a OLCOMEP 2026.</p>
            <a className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand-primary px-5 py-3 font-bold text-white hover:bg-brand-primary/90" href="/data/2026/Inscripcion-masiva-OLCOMEP-2026.xlsx">
              <FileSpreadsheet aria-hidden="true" /> Descargar plantilla XLSX
            </a>
          </div>
          <div className="overflow-hidden rounded-xl bg-white p-3">
            <img alt="Anuncio del patrocinio del Centro Cultural Costarricense Norteamericano a OLCOMEP" className="h-auto w-full rounded-lg" height="300" loading="lazy" src="/assets/legacy/current-edition/centro-cultural.jpg" width="370" />
            <a className="mt-3 inline-flex min-h-11 items-center gap-2 px-2 font-bold text-brand-primary underline decoration-2 underline-offset-4 hover:text-brand-accent" href="https://www.youtube.com/watch?v=3kaI2PLOzG0" rel="noopener noreferrer" target="_blank">
              Ver video de promoción <ExternalLink aria-hidden="true" size={17} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

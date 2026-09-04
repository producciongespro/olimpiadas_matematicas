import { ExternalLink, Gamepad2 } from 'lucide-react'
import { useState } from 'react'
import { interactiveBooklets } from './interactive-booklets.js'

const gradeNames = { 1: 'Primer año', 2: 'Segundo año', 3: 'Tercer año', 4: 'Cuarto año', 5: 'Quinto año', 6: 'Sexto año' }

export function InteractiveBooklets() {
  const years = Object.keys(interactiveBooklets).sort((a, b) => b - a)
  const [activeYear, setActiveYear] = useState(years[0])

  return (
    <section id="interactivos" className="scroll-mt-28 bg-brand-soft py-16 sm:py-20" aria-labelledby="titulo-interactivos">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-primary text-white"><Gamepad2 aria-hidden="true" /></div>
            <p className="eyebrow mt-6 text-brand-primary">Práctica en línea</p>
            <h2 id="titulo-interactivos" className="section-title mt-3">Cuadernillos interactivos</h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-700">Actividades publicadas entre 2020 y 2022 para practicar directamente en Genially. Todos los enlaces fueron comprobados el 4 de septiembre de 2026.</p>
          </div>

          <div>
            <label className="block max-w-xs font-bold text-slate-900" htmlFor="interactive-year">
              Seleccione la edición
              <select className="mt-2 min-h-12 w-full rounded-lg border border-line bg-white px-4 text-base font-bold text-slate-900" id="interactive-year" onChange={(event) => setActiveYear(event.target.value)} value={activeYear}>
                {years.map((year) => <option key={year} value={year}>{year}</option>)}
              </select>
            </label>

            <ul className="mt-6 grid gap-x-8 sm:grid-cols-2">
              {interactiveBooklets[activeYear].map(([grade, part, href, image]) => (
                <li className="border-b border-brand-primary/20" key={`${activeYear}-${grade}-${part}`}>
                  <a className="group flex min-h-28 items-center gap-4 py-4" href={href} rel="noopener noreferrer" target="_blank">
                    <img alt="" className="h-20 w-20 shrink-0 object-contain" height="80" loading="lazy" src={image} width="80" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-lg font-black text-slate-900 group-hover:text-brand-primary">{gradeNames[grade]}</span>
                      <span className="mt-1 block text-sm text-slate-600">{activeYear === '2020' ? `Parte ${part}` : `Actividad ${part}`} · Genially</span>
                    </span>
                    <ExternalLink aria-hidden="true" className="shrink-0 text-brand-primary" size={20} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

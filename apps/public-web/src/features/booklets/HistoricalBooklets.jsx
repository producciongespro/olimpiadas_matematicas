import { Download, GraduationCap, UserRound } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import catalog from './historical-booklets.json'

const roleMeta = {
  estudiante: { icon: UserRound, label: 'Estudiantes' },
  docente: { icon: GraduationCap, label: 'Docentes' },
  general: { icon: UserRound, label: 'Colección general' },
}

const gradeNames = {
  1: 'Primer año',
  2: 'Segundo año',
  3: 'Tercer año',
  4: 'Cuarto año',
  5: 'Quinto año',
  6: 'Sexto año',
}

export function HistoricalBooklets() {
  const years = Object.keys(catalog)
  const [activeYear, setActiveYear] = useState(years[0])
  const availableRoles = useMemo(() => [...new Set(catalog[activeYear].map((item) => item.role))], [activeYear])
  const [activeRole, setActiveRole] = useState(availableRoles[0])

  useEffect(() => {
    if (!availableRoles.includes(activeRole)) setActiveRole(availableRoles[0])
  }, [activeRole, availableRoles])

  const resources = catalog[activeYear].filter((item) => item.role === activeRole)

  return (
    <section className="bg-slate-950 py-16 text-white sm:py-20" aria-labelledby="titulo-historicos">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="eyebrow text-brand-highlight">Archivo histórico</p>
            <h2 id="titulo-historicos" className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Cuadernillos 2016–2024</h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">Seleccione una edición y el tipo de material. Se conservan los archivos y recursos visuales publicados originalmente.</p>
          </div>

          <div className="grid content-end gap-5 sm:grid-cols-[0.65fr_1.35fr]">
            <label className="block font-bold" htmlFor="booklet-year">
              Edición
              <select className="mt-2 min-h-12 w-full rounded-lg border border-white/30 bg-white px-4 text-base font-bold text-slate-900" id="booklet-year" onChange={(event) => setActiveYear(event.target.value)} value={activeYear}>
                {years.map((year) => <option key={year} value={year}>{year}</option>)}
              </select>
            </label>

            <fieldset>
              <legend className="font-bold">Tipo de material</legend>
              <div className="mt-2 flex min-h-12 rounded-lg bg-white/10 p-1">
                {availableRoles.map((role) => {
                  const Icon = roleMeta[role].icon
                  const active = role === activeRole
                  return (
                    <button aria-pressed={active} className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 font-bold ${active ? 'bg-white text-brand-primary' : 'text-white hover:bg-white/10'}`} key={role} onClick={() => setActiveRole(role)} type="button">
                      <Icon aria-hidden="true" size={18} /> {roleMeta[role].label}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          </div>
        </div>

        <div className="mt-10 border-t border-white/20 pt-8">
          <p className="font-bold text-brand-highlight" aria-live="polite">Edición {activeYear} · {roleMeta[activeRole].label}</p>
          <ul className="mt-4 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => {
              const label = resource.grade ? gradeNames[resource.grade] : 'Colección completa'
              return (
                <li className="border-b border-white/20" key={resource.href}>
                  <a className="group flex min-h-28 items-center gap-4 py-4" href={resource.href} rel="noopener noreferrer" target="_blank">
                    <img alt="" className="h-16 w-16 shrink-0 object-contain" height="64" loading="lazy" src={resource.image} width="64" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-lg font-black group-hover:text-brand-highlight">{label}</span>
                      <span className="mt-1 block text-sm text-slate-300">Cuadernillo {activeYear} · PDF</span>
                    </span>
                    <Download aria-hidden="true" className="shrink-0 text-brand-highlight" size={20} />
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}

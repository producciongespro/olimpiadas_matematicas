import { Mail, MapPin, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { regionalCoordinations } from './regionalCoordinations.js'

export function RegionalCoordinationSection() {
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLocaleLowerCase('es-CR')
  const filteredCoordinations = useMemo(() => regionalCoordinations.filter(({ contacts, region }) => {
    if (!normalizedQuery) return true
    return [region, ...contacts.flatMap(({ emails, name }) => [name, ...emails])]
      .some((value) => value.toLocaleLowerCase('es-CR').includes(normalizedQuery))
  }), [normalizedQuery])

  return (
    <section id="coordinaciones-regionales" className="scroll-mt-28 border-t border-line py-16 sm:py-20" aria-labelledby="titulo-coordinaciones-regionales">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="eyebrow text-brand-primary">Presencia en todo el país</p>
            <h2 id="titulo-coordinaciones-regionales" className="section-title mt-3">Coordinaciones regionales</h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-700">
              Las asesorías regionales de Matemáticas dieron origen a las primeras experiencias olímpicas y continúan siendo parte esencial del alcance territorial de OLCOMEP.
            </p>
          </div>

          <div className="border-y border-line py-8">
            <div className="grid items-center gap-6 sm:grid-cols-[auto_1fr]">
              <div className="flex items-center gap-4 text-brand-primary">
                <MapPin aria-hidden="true" size={40} strokeWidth={1.8} />
                <span className="text-7xl font-black leading-none sm:text-8xl">27</span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">Direcciones Regionales de Educación</h3>
                <p className="mt-3 leading-7 text-slate-700">Las 27 regiones educativas del país participan activamente en el proceso, incluidas comunidades fronterizas, insulares, de montaña y de difícil acceso.</p>
              </div>
            </div>

          </div>
        </div>

        <div className="mt-12">
          <div className="grid items-end gap-5 md:grid-cols-[1fr_minmax(18rem,28rem)]">
            <div>
              <h3 className="text-2xl font-black text-slate-900">Directorio regional</h3>
              <p className="mt-2 text-slate-600" aria-live="polite">{filteredCoordinations.length} de {regionalCoordinations.length} regiones</p>
            </div>
            <label className="grid gap-2 font-bold text-slate-800" htmlFor="buscar-coordinacion">
              Buscar por región o persona
              <span className="relative">
                <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  className="min-h-11 w-full rounded-md border border-slate-400 bg-white py-2 pl-10 pr-3 text-slate-900"
                  id="buscar-coordinacion"
                  onChange={(event) => setQuery(event.target.value)}
                  type="search"
                  value={query}
                />
              </span>
            </label>
          </div>

          {filteredCoordinations.length > 0 ? (
            <ul className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredCoordinations.map(({ contacts, region }) => (
                <li className="rounded-lg border border-line bg-white p-5" key={region}>
                  <h4 className="flex items-start gap-2 text-lg font-black text-slate-900"><MapPin aria-hidden="true" className="mt-0.5 shrink-0 text-brand-primary" size={20} />{region}</h4>
                  <p className="mt-2 text-sm font-bold text-slate-500">Asesoría Regional de Matemática</p>
                  <div className="mt-5 space-y-5">
                    {contacts.map(({ emails, name }) => (
                      <div key={name}>
                        <p className="font-bold text-slate-800">{name}</p>
                        {emails.length > 0 ? emails.map((email) => (
                          <a className="mt-2 flex min-h-11 items-center gap-2 break-all text-sm font-bold text-brand-primary underline decoration-2 underline-offset-4 hover:text-brand-accent" href={`mailto:${email}`} key={email}>
                            <Mail aria-hidden="true" className="shrink-0" size={17} />{email}
                          </a>
                        )) : <p className="mt-2 text-sm text-slate-500">Correo institucional pendiente de confirmación.</p>}
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-8 rounded-lg border border-dashed border-slate-400 p-8 text-center text-slate-600" role="status">No se encontraron coordinaciones con ese criterio.</p>
          )}
        </div>
      </div>
    </section>
  )
}

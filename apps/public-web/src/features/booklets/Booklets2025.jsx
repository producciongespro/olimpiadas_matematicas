import { Download, GraduationCap, UserRound } from 'lucide-react'
import { useState } from 'react'

const grades = [
  { file: '1ero', icon: '01', label: 'Primer año' },
  { file: '2do', icon: '02', label: 'Segundo año' },
  { file: '3ero', icon: '03', label: 'Tercer año' },
  { file: '4to', icon: '04', label: 'Cuarto año' },
  { file: '5to', icon: '05', label: 'Quinto año' },
  { file: '6to', icon: '06', label: 'Sexto año' },
]

const roles = {
  estudiante: {
    description: 'Material de práctica para conocer el tipo de problemas utilizados en las diferentes etapas.',
    fileSuffix: 'ESTUDIANTE',
    icon: UserRound,
    label: 'Estudiantes',
  },
  docente: {
    description: 'Material de apoyo para orientar la preparación y el acompañamiento del estudiantado.',
    fileSuffix: 'DOCENTE',
    icon: GraduationCap,
    label: 'Docentes',
  },
}

export function Booklets2025() {
  const [activeRole, setActiveRole] = useState('estudiante')
  const role = roles[activeRole]
  const RoleIcon = role.icon

  return (
    <section id="cuadernillos" className="scroll-mt-28 py-16 sm:py-20" aria-labelledby="titulo-cuadernillos">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div>
            <p className="eyebrow text-brand-primary">Recursos de preparación</p>
            <h2 id="titulo-cuadernillos" className="section-title mt-3">Colección de cuadernillos</h2>
          </div>
          <p className="max-w-3xl text-lg leading-8 text-slate-700">
            Estos materiales recopilan ejercicios aplicados en etapas circuitales y regionales. Ofrecen a estudiantes y docentes un panorama de los problemas que pueden encontrar durante las eliminatorias.
          </p>
        </div>

        <div id="cuadernillos-2025" className="mt-12 scroll-mt-28 border-t-4 border-brand-primary pt-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-brand-accent">Edición más reciente disponible</p>
              <h3 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">Cuadernillos 2025</h3>
            </div>

            <div className="inline-flex w-full rounded-lg bg-slate-100 p-1 md:w-auto" aria-label="Tipo de cuadernillo">
              {Object.entries(roles).map(([key, item]) => {
                const Icon = item.icon
                const active = key === activeRole
                return (
                  <button
                    aria-pressed={active}
                    className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 font-bold transition-colors motion-reduce:transition-none md:flex-none ${active ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                    key={key}
                    onClick={() => setActiveRole(key)}
                    type="button"
                  >
                    <Icon aria-hidden="true" size={19} /> {item.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[0.55fr_1.45fr]">
            <div className="rounded-xl bg-brand-primary p-6 text-white">
              <RoleIcon aria-hidden="true" size={32} />
              <h4 className="mt-5 text-2xl font-black">Para {role.label.toLowerCase()}</h4>
              <p className="mt-3 leading-7 text-white/85">{role.description}</p>
              <p className="mt-6 text-sm font-bold text-brand-highlight">Seleccione el año que desea descargar.</p>
            </div>

            <ul className="grid gap-x-8 sm:grid-cols-2">
              {grades.map((grade) => {
                const isTeacher = activeRole === 'docente'
                const fileName = `cuadernillo_mateamtica_${grade.file}_2025-${role.fileSuffix}.pdf`
                const iconName = `ico-${grade.icon}-2025${isTeacher ? '-docente' : ''}.png`
                return (
                  <li className="border-b border-line" key={`${activeRole}-${grade.file}`}>
                    <a className="group flex min-h-28 items-center gap-4 py-4" href={`/data/2025/cuadernillos/${fileName}`} rel="noopener noreferrer" target="_blank">
                      <img alt="" className="h-20 w-20 shrink-0 object-contain" height="80" loading="lazy" src={`/assets/legacy/booklets/2025/${iconName}`} width="80" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-lg font-black text-slate-900 group-hover:text-brand-primary">{grade.label}</span>
                        <span className="mt-1 block text-sm text-slate-600">Cuadernillo para {role.label.toLowerCase()} · PDF</span>
                      </span>
                      <Download aria-hidden="true" className="shrink-0 text-brand-primary" size={21} />
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

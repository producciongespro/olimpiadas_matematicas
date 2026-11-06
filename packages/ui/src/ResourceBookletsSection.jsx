import { Download, ExternalLink } from 'lucide-react'
import { useEffect, useState } from 'react'

const roleLabels = { estudiante: 'Estudiantes', docente: 'Docentes', general: 'Colección general' }
const safeLink = (href) => /^https?:\/\//i.test(href) ? { target: '_blank', rel: 'noopener noreferrer' } : { target: '_blank', rel: 'noopener noreferrer' }

function EditionCatalog({ editions, type, title, description, id, dark = false }) {
  const isInteractive = type === 'interactive'
  const available = editions.filter((edition) => edition.type === type)
  const [year, setYear] = useState(String(available[0]?.year || ''))
  const edition = available.find((item) => String(item.year) === year) || available[0]
  const roles = [...new Set(edition?.materials.map((item) => item.role) || [])]
  const [role, setRole] = useState(roles[0] || '')
  useEffect(() => { if (!roles.includes(role)) setRole(roles[0] || '') }, [role, edition])
  const editionMaterials = edition?.materials || []
  const materials = isInteractive ? editionMaterials : editionMaterials.filter((item) => item.role === role)
  return <section id={id} className={`scroll-mt-28 py-16 sm:py-20 ${dark ? 'bg-slate-950 text-white' : 'bg-brand-soft text-slate-900'}`} aria-labelledby={`${id}-title`}>
    <div className="mx-auto max-w-content px-5 sm:px-8"><div className="grid gap-8 lg:grid-cols-2"><div><p className={`eyebrow ${dark ? 'text-brand-highlight' : 'text-brand-primary'}`}>{type === 'interactive' ? 'Práctica en línea' : 'Archivo histórico'}</p><h2 id={`${id}-title`} className="section-title mt-3">{title}</h2><p className={`mt-5 max-w-xl text-lg leading-8 ${dark ? 'text-slate-300' : 'text-slate-700'}`}>{description}</p></div><div className="grid content-end gap-4 sm:grid-cols-2"><label className="font-bold">Edición<select className="mt-2 min-h-12 w-full rounded-lg border border-line bg-white px-4 text-slate-900" onChange={(event) => setYear(event.target.value)} value={String(edition?.year || '')}>{available.map((item) => <option key={`${item.type}-${item.year}`} value={item.year}>{item.year}</option>)}</select></label>{!isInteractive && <label className="font-bold">Tipo de material<select className="mt-2 min-h-12 w-full rounded-lg border border-line bg-white px-4 text-slate-900" onChange={(event) => setRole(event.target.value)} value={role}>{roles.map((item) => <option key={item} value={item}>{roleLabels[item]}</option>)}</select></label>}</div></div>
      {available.length === 0 ? <p className="mt-8 rounded-lg border border-dashed p-6">No hay materiales publicados en esta colección.</p> : materials.length === 0 ? <p className="mt-8 rounded-lg border border-dashed p-6">No hay materiales para esta selección.</p> : <ul className="mt-8 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">{materials.map((item) => <li className={`border-b ${dark ? 'border-white/20' : 'border-brand-primary/20'}`} key={item.key}><a className="group flex min-h-28 items-center gap-4 py-4" href={item.href} {...safeLink(item.href)}>{item.image && <img alt="" className="h-16 w-16 shrink-0 object-contain" height="64" loading="lazy" src={item.image} width="64"/>}<span className="min-w-0 flex-1"><strong className="block text-lg">{item.title}</strong><span className={dark ? 'text-sm text-slate-300' : 'text-sm text-slate-600'}>{item.description}</span></span>{type === 'interactive' ? <ExternalLink aria-hidden="true" size={20}/> : <Download aria-hidden="true" size={20}/>}</a></li>)}</ul>}
    </div>
  </section>
}

function RecentCatalog({ edition }) {
  const roles = ['estudiante', 'docente', 'general'].filter((value) => edition.materials.some((item) => item.role === value))
  const [role, setRole] = useState('todos')
  useEffect(() => { if (role !== 'todos' && !roles.includes(role)) setRole('todos') }, [roles, role])
  const materials = role === 'todos' ? edition.materials : edition.materials.filter((item) => item.role === role)

  return <div className="mt-8">
    <div className="flex flex-wrap items-end justify-between gap-5">
      <h3 className="text-2xl font-black">Cuadernillos {edition.year}</h3>
      {roles.length > 0 && <label className="w-full max-w-xs font-bold sm:w-64">Tipo de material<select className="mt-2 min-h-12 w-full rounded-lg border border-line bg-white px-4 text-slate-900" onChange={(event) => setRole(event.target.value)} value={role}><option value="todos">Todos</option>{roles.map((value) => <option key={value} value={value}>{roleLabels[value]}</option>)}</select></label>}
    </div>
    {materials.length === 0 ? <p className="mt-5 rounded-lg border border-dashed p-6">No hay cuadernillos para esta selección.</p> : <ul className="mt-5 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">{materials.map((item) => <li className="border-b border-line" key={item.key}><a className="flex min-h-20 items-center gap-3 py-3 font-bold text-brand-primary" href={item.href} {...safeLink(item.href)}>{item.image && <img alt="" className="h-14 w-14 object-contain" src={item.image}/>}<span>{item.title}</span><Download aria-hidden="true" size={18}/></a></li>)}</ul>}
  </div>
}

export function ResourceBookletsSection({ content }) {
  const recent = content.editions.filter((item) => item.type === 'pdf').sort((a, b) => b.year - a.year)[0]
  return <>
    <section id="cuadernillos" className="scroll-mt-28 py-16 sm:py-20" aria-labelledby="titulo-cuadernillos"><div className="mx-auto max-w-content px-5 sm:px-8"><p className="eyebrow text-brand-primary">{content.eyebrow}</p><h2 id="titulo-cuadernillos" className="section-title mt-3">{content.title}</h2><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">{content.description}</p>{recent ? <RecentCatalog edition={recent} key={recent.year}/> : <p className="mt-8 rounded-lg border border-dashed p-6">No hay cuadernillos publicados.</p>}</div></section>
    <EditionCatalog editions={content.editions.filter((item) => item !== recent)} type="pdf" title="Archivo histórico" description="Seleccione una edición y el tipo de material." id="historicos" dark/>
    <EditionCatalog editions={content.editions} type="interactive" title="Cuadernillos interactivos" description="Actividades para practicar en línea." id="interactivos"/>
  </>
}

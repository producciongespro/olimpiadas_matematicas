import { ChevronLeft, ChevronRight, Mail, MapPin, Search, UserRound } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function RegionalCoordinationSection({ content }) {
  const [query, setQuery] = useState('')
  const [carouselState, setCarouselState] = useState({ canNext: false, canPrevious: false, current: 1 })
  const carouselRef = useRef(null)
  const normalizedQuery = query.trim().toLocaleLowerCase('es-CR')
  const advisors = useMemo(() => content.regions.flatMap(({ contacts, region }, regionIndex) => {
    if (contacts.length === 0) return [{ emails: [], key: `empty-${regionIndex}`, name: '', region }]
    return contacts.map((contact, contactIndex) => ({ ...contact, key: contact.key || `${region}-${contact.name}-${contactIndex}`, region }))
  }), [content.regions])
  const filtered = useMemo(() => advisors.filter(({ emails, name, region }) => !normalizedQuery || [region, name, ...emails].some((value) => value.toLocaleLowerCase('es-CR').includes(normalizedQuery))), [advisors, normalizedQuery])
  const regionCount = useMemo(() => new Set(filtered.map(({ region }) => region)).size, [filtered])

  const updateCarouselState = useCallback(() => {
    const carousel = carouselRef.current
    if (!carousel || carousel.children.length === 0) {
      setCarouselState({ canNext: false, canPrevious: false, current: 1 })
      return
    }

    const children = Array.from(carousel.children)
    const current = children.reduce((nearestIndex, child, index) => (
      Math.abs(child.offsetLeft - carousel.scrollLeft) < Math.abs(children[nearestIndex].offsetLeft - carousel.scrollLeft) ? index : nearestIndex
    ), 0)
    setCarouselState({
      canNext: carousel.scrollLeft + carousel.clientWidth < carousel.scrollWidth - 2,
      canPrevious: carousel.scrollLeft > 2,
      current: current + 1,
    })
  }, [])

  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return undefined

    carousel.scrollTo({ left: 0, behavior: 'auto' })
    const frame = window.requestAnimationFrame(updateCarouselState)
    const observer = new ResizeObserver(updateCarouselState)
    observer.observe(carousel)
    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [filtered.length, normalizedQuery, updateCarouselState])

  const moveCarousel = (direction) => {
    const carousel = carouselRef.current
    if (!carousel) return
    const children = Array.from(carousel.children)
    const targets = direction > 0 ? children : children.reverse()
    const target = targets.find((child) => direction > 0
      ? child.offsetLeft > carousel.scrollLeft + 8
      : child.offsetLeft < carousel.scrollLeft - 8)
    carousel.scrollTo({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      left: target?.offsetLeft ?? (direction > 0 ? carousel.scrollWidth : 0),
    })
  }

  return <section id="coordinaciones-regionales" className="scroll-mt-28 border-t border-line py-16 sm:py-20" aria-labelledby="titulo-coordinaciones-regionales"><div className="mx-auto max-w-content px-5 sm:px-8">
    <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16"><div><p className="eyebrow text-brand-primary">{content.eyebrow}</p><h2 id="titulo-coordinaciones-regionales" className="section-title mt-3">{content.title}</h2><p className="mt-5 max-w-xl text-lg leading-8 text-slate-700">{content.description}</p></div><div className="border-y border-line py-8"><div className="grid items-center gap-6 sm:grid-cols-[auto_1fr]"><div className="flex items-center gap-4 text-brand-primary"><MapPin aria-hidden="true" size={40} strokeWidth={1.8}/><span className="text-7xl font-black leading-none sm:text-8xl">{content.regions.length}</span></div><div><h3 className="text-2xl font-black text-slate-900">{content.summary_title}</h3><p className="mt-3 leading-7 text-slate-700">{content.summary_description}</p></div></div></div></div>
    <div className="mt-12"><div className="grid items-end gap-5 md:grid-cols-[1fr_minmax(18rem,28rem)]"><div><h3 className="text-2xl font-black text-slate-900">{content.directory_title}</h3><p className="mt-2 text-slate-600" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'asesoría' : 'asesorías'} en {regionCount} {regionCount === 1 ? 'región' : 'regiones'}</p></div><label className="grid gap-2 font-bold text-slate-800">{content.search_label}<span className="relative"><Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20}/><input className="min-h-11 w-full rounded-md border border-slate-400 bg-white py-2 pl-10 pr-3 text-slate-900 outline-none transition focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/15" onChange={(event) => setQuery(event.target.value)} type="search" value={query}/></span></label></div>
    {filtered.length > 0 ? <div className="mt-8" role="region" aria-label="Carrusel de asesorías regionales" aria-roledescription="carrusel">
      <div className="mb-5 flex items-center justify-between gap-4"><p className="text-sm font-bold text-slate-600" aria-atomic="true" aria-live="polite">Tarjeta {carouselState.current} de {filtered.length}</p><div className="flex gap-2"><button aria-label="Mostrar asesoría anterior" className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-800 shadow-sm transition hover:border-brand-primary hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:cursor-not-allowed disabled:opacity-40" disabled={!carouselState.canPrevious} onClick={() => moveCarousel(-1)} type="button"><ChevronLeft aria-hidden="true" size={22}/></button><button aria-label="Mostrar asesoría siguiente" className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-800 shadow-sm transition hover:border-brand-primary hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:cursor-not-allowed disabled:opacity-40" disabled={!carouselState.canNext} onClick={() => moveCarousel(1)} type="button"><ChevronRight aria-hidden="true" size={22}/></button></div></div>
      <ul className="regional-carousel flex snap-x snap-mandatory gap-5 overflow-x-auto pb-5 scroll-smooth motion-reduce:scroll-auto" onScroll={updateCarouselState} ref={carouselRef}>
        {filtered.map(({ emails, key, name, photo_height, photo_url, photo_width, region }) => <li aria-label={`${region}${name ? `, ${name}` : ''}`} aria-roledescription="tarjeta" className="regional-carousel-card flex h-auto shrink-0 snap-start" key={key}><article className="flex w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_14px_38px_-28px_rgba(15,23,42,0.7)] transition duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_20px_45px_-28px_rgba(15,23,42,0.75)] motion-reduce:transform-none motion-reduce:transition-none"><div className="relative flex min-h-56 items-end justify-center overflow-hidden bg-slate-100 px-6 pt-6"><div className="absolute inset-x-0 top-0 h-24 bg-brand-primary/10" aria-hidden="true"/><div className="relative aspect-[5/7] w-36 overflow-hidden rounded-t-[2rem] border-x border-t border-white/80 bg-slate-200 shadow-lg">{photo_url ? <img alt="" className="h-full w-full object-cover" decoding="async" height={photo_height || 700} loading="lazy" src={photo_url} width={photo_width || 500}/> : <span className="flex h-full w-full items-center justify-center text-slate-400"><UserRound aria-hidden="true" size={68} strokeWidth={1.25}/></span>}</div></div><div className="flex flex-1 flex-col p-6"><p className="flex items-start gap-2 text-sm font-black uppercase tracking-wide text-brand-primary"><MapPin aria-hidden="true" className="mt-0.5 shrink-0" size={17}/>{region}</p>{name ? <><h4 className="mt-3 text-xl font-black leading-7 text-slate-900">{name}</h4><p className="mt-1 text-sm font-bold text-slate-500">Asesoría Regional de Matemática</p>{emails.length > 0 ? <div className="mt-4 border-t border-slate-200 pt-3">{emails.map((email) => <a className="flex min-h-11 items-center gap-2 break-all text-sm font-bold text-brand-primary underline decoration-2 underline-offset-4" href={`mailto:${email}`} key={email}><Mail aria-hidden="true" className="shrink-0" size={17}/>{email}</a>)}</div> : <p className="mt-4 border-t border-slate-200 pt-4 text-sm text-slate-500">Correo institucional pendiente de confirmación.</p>}</> : <><h4 className="mt-3 text-xl font-black text-slate-900">Asesoría pendiente</h4><p className="mt-3 text-sm leading-6 text-slate-600">La información de contacto para esta región se encuentra pendiente de publicación.</p></>}</div></article></li>)}
      </ul>
    </div> : <p className="mt-8 rounded-lg border border-dashed border-slate-400 p-8 text-center text-slate-600" role="status">{content.regions.length === 0 ? 'No hay coordinaciones publicadas.' : 'No se encontraron coordinaciones con ese criterio.'}</p>}</div>
  </div></section>
}

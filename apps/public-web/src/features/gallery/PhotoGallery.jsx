import { createApiClient } from '@olcomep/api-client'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'

const api = createApiClient()

export function PhotoGallery() {
  const [events, setEvents] = useState([])
  const [event, setEvent] = useState(null)
  const [active, setActive] = useState(0)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    api.events().then(async (items) => {
      setEvents(items)
      if (items.length) setEvent(await api.event(items[0].slug))
      setStatus('success')
    }).catch(() => setStatus('error'))
  }, [])

  const chooseEvent = async (slug) => {
    setStatus('loading')
    try { setEvent(await api.event(slug)); setActive(0); setStatus('success') } catch { setStatus('error') }
  }
  const images = event?.images || []
  const show = (index) => setActive((index + images.length) % images.length)

  return (
    <section id="galeria" className="scroll-mt-28 py-16 sm:py-20" aria-labelledby="titulo-galeria">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div><p className="eyebrow text-brand-primary">Memoria OLCOMEP</p><h2 id="titulo-galeria" className="section-title mt-3">Galería de eventos</h2></div>
          {events.length > 0 && <label className="grid gap-2 text-sm font-bold text-slate-700" htmlFor="evento-galeria">Elegir evento<select className="min-h-11 rounded-md border border-slate-300 bg-white px-3 text-base" id="evento-galeria" onChange={(e) => chooseEvent(e.target.value)} value={event?.slug || ''}>{events.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}</select></label>}
        </div>
        <div className="mt-8" aria-live="polite">
          {status === 'loading' && <p className="rounded-md bg-slate-100 p-6">Cargando galería…</p>}
          {status === 'error' && <div className="rounded-md border border-red-200 bg-red-50 p-6"><p>No fue posible cargar la galería.</p><button className="mt-3 font-bold text-brand-primary underline" onClick={() => window.location.reload()} type="button">Intentar nuevamente</button></div>}
          {status === 'success' && !event && <p className="rounded-md bg-slate-100 p-6">Todavía no hay eventos publicados.</p>}
          {status === 'success' && event && <>
            <div className="max-w-3xl"><h3 className="text-2xl font-black text-slate-900">{event.name}</h3>{event.event_date && <p className="mt-1 text-sm font-bold text-brand-primary">{new Date(`${event.event_date}T12:00:00`).toLocaleDateString('es-CR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>}{event.description && <p className="mt-3 leading-7 text-slate-700">{event.description}</p>}</div>
            {images.length > 0 ? <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
              <figure className="overflow-hidden rounded-gallery bg-slate-100"><img alt={images[active].alt_text} className="aspect-[4/3] w-full object-cover" height={images[active].height} src={images[active].media_url} width={images[active].width}/>{images[active].caption && <figcaption className="px-4 py-3 text-sm text-slate-700">{images[active].caption}</figcaption>}</figure>
              <div className="grid grid-cols-3 content-start gap-2 lg:grid-cols-2">{images.map((image, index) => <button aria-current={index === active ? 'true' : undefined} aria-label={`Mostrar fotografía ${index + 1}`} className={`overflow-hidden rounded-md border-4 ${index === active ? 'border-brand-highlight' : 'border-transparent'}`} key={image.id} onClick={() => show(index)} type="button"><img alt="" className="aspect-square w-full object-cover" loading="lazy" src={image.media_url}/></button>)}</div>
              {images.length > 1 && <div className="flex gap-2 lg:col-start-1"><button className="icon-button" onClick={() => show(active - 1)} type="button"><ChevronLeft aria-hidden="true"/><span className="sr-only">Fotografía anterior</span></button><button className="icon-button" onClick={() => show(active + 1)} type="button"><ChevronRight aria-hidden="true"/><span className="sr-only">Fotografía siguiente</span></button><span className="self-center text-sm text-slate-600">{active + 1} de {images.length}</span></div>}
            </div> : <p className="mt-6 rounded-md bg-slate-100 p-6">Este evento todavía no tiene fotografías disponibles.</p>}
          </>}
        </div>
      </div>
    </section>
  )
}

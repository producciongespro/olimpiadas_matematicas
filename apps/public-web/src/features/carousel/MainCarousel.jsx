import { createApiClient } from '@olcomep/api-client'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'

const api = createApiClient()
const ROTATION_INTERVAL = 6000

export function MainCarousel() {
  const [slides, setSlides] = useState([])
  const [active, setActive] = useState(0)
  const [status, setStatus] = useState('loading')
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    api.carousel()
      .then((data) => { setSlides(data); setStatus('success') })
      .catch(() => setStatus('error'))
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setReducedMotion(mediaQuery.matches)
    updatePreference()
    mediaQuery.addEventListener('change', updatePreference)
    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  useEffect(() => {
    if (slides.length < 2 || paused || reducedMotion) return undefined
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), ROTATION_INTERVAL)
    return () => window.clearInterval(timer)
  }, [paused, reducedMotion, slides.length])

  if (status === 'loading') {
    return <div className="h-2 bg-brand-highlight" role="status"><span className="sr-only">Cargando imágenes destacadas</span></div>
  }
  if (status === 'error' || slides.length === 0) return null

  const show = (index) => {
    setPaused(true)
    setActive((index + slides.length) % slides.length)
  }
  const slide = slides[active]

  return (
    <section
      aria-label="Imágenes destacadas"
      className="bg-white px-5 py-4 sm:px-8 sm:py-6"
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false) }}
      onFocus={() => setPaused(true)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative mx-auto max-w-content overflow-hidden rounded-gallery bg-slate-950">
        <img
          alt={slide.alt_text}
          className="main-carousel-image w-full object-cover opacity-80"
          height={slide.height}
          src={slide.media_url}
          width={slide.width}
        />
        {(slide.title || slide.link_url) && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 to-transparent px-5 pb-5 pt-14 text-white sm:px-8">
            <div className="mx-auto max-w-content">
              {slide.title && <p className="max-w-3xl text-xl font-black sm:text-2xl">{slide.title}</p>}
              {slide.link_url && <a className="button-primary mt-3" href={slide.link_url}>{slide.link_label || 'Conocer más'}</a>}
            </div>
          </div>
        )}
        {slides.length > 1 && (
          <div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-between">
            <button className="carousel-button" onClick={() => show(active - 1)} type="button"><ChevronLeft aria-hidden="true"/><span className="sr-only">Imagen anterior</span></button>
            <button className="carousel-button" onClick={() => show(active + 1)} type="button"><ChevronRight aria-hidden="true"/><span className="sr-only">Imagen siguiente</span></button>
          </div>
        )}
      {slides.length > 1 && (
        <div className="absolute bottom-1 left-1/2 flex max-w-[calc(100%-7rem)] -translate-x-1/2 gap-0.5 overflow-x-auto" aria-label="Seleccionar imagen destacada">
          {slides.map((item, index) => (
            <button aria-current={index === active ? 'true' : undefined} aria-label={`Mostrar imagen ${index + 1}`} className="flex h-11 w-11 items-center justify-center" key={item.id} onClick={() => show(index)} type="button">
              <span className={`h-2 rounded-full ${index === active ? 'w-7 bg-brand-highlight' : 'w-2 bg-white/70'}`}/>
            </button>
          ))}
        </div>
      )}
      <p className="sr-only" aria-live="polite">Imagen {active + 1} de {slides.length}</p>
      </div>
    </section>
  )
}

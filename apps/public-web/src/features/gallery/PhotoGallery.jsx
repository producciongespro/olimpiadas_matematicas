import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

const slides = [[15, 14, 13], [12, 11, 10], [9, 8, 7], [6, 5, 4], [3, 2, 1]]

export function PhotoGallery() {
  const [activeSlide, setActiveSlide] = useState(0)
  const show = (index) => setActiveSlide((index + slides.length) % slides.length)

  return (
    <section id="galeria" className="scroll-mt-28 py-16 sm:py-20" aria-labelledby="titulo-galeria">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow text-brand-primary">OLCOMEP en acción</p>
            <h2 id="titulo-galeria" className="section-title mt-3">Aprender también es explorar</h2>
          </div>
          <div className="flex gap-2" aria-label="Controles de la galería">
            <button className="icon-button" onClick={() => show(activeSlide - 1)} type="button"><ChevronLeft aria-hidden="true" /><span className="sr-only">Fotografías anteriores</span></button>
            <button className="icon-button" onClick={() => show(activeSlide + 1)} type="button"><ChevronRight aria-hidden="true" /><span className="sr-only">Fotografías siguientes</span></button>
          </div>
        </div>

        <div className="mt-8" aria-live="polite" aria-atomic="true">
          <p className="sr-only">Grupo de fotografías {activeSlide + 1} de {slides.length}</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {slides[activeSlide].map((number, index) => (
              <figure className={`${index > 0 ? 'hidden sm:block' : ''} overflow-hidden rounded-gallery bg-slate-100`} key={number}>
                <img alt={`Actividad educativa de OLCOMEP, fotografía ${number}`} className="aspect-[4/3] h-full w-full object-cover" height="600" loading={activeSlide === 0 ? 'eager' : 'lazy'} src={`/assets/legacy/gallery/olimp${number}.jpg`} width="800" />
              </figure>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2" aria-label="Seleccionar grupo de fotografías">
          {slides.map((_, index) => (
            <button aria-current={index === activeSlide ? 'true' : undefined} aria-label={`Mostrar grupo ${index + 1}`} className="group flex h-11 w-11 items-center justify-center rounded-md" key={index} onClick={() => show(index)} type="button">
              <span aria-hidden="true" className={`h-3 rounded-full transition-[width,background-color] motion-reduce:transition-none ${index === activeSlide ? 'w-8 bg-brand-primary' : 'w-3 bg-slate-300 group-hover:bg-slate-400'}`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

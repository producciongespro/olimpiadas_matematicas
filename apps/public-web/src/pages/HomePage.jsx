import { SiteFooter } from '../components/SiteFooter.jsx'
import { SiteHeader } from '../components/SiteHeader.jsx'
import { Booklets2025 } from '../features/booklets/Booklets2025.jsx'
import { HistoricalBooklets } from '../features/booklets/HistoricalBooklets.jsx'
import { CurrentEdition } from '../features/current-edition/CurrentEdition.jsx'
import { ContactSection } from '../features/contact/ContactSection.jsx'
import { PhotoGallery } from '../features/gallery/PhotoGallery.jsx'
import { InteractiveBooklets } from '../features/interactive-booklets/InteractiveBooklets.jsx'

export function HomePage() {
  return (
    <div className="min-h-screen bg-white text-ink">
      <a className="skip-link" href="#contenido-principal">Saltar al contenido principal</a>
      <SiteHeader />

      <main id="contenido-principal">
        <section className="overflow-hidden bg-brand-primary text-white" aria-labelledby="titulo-principal">
          <div className="mx-auto grid max-w-content grid-cols-[minmax(0,1fr)] items-end gap-10 px-5 pb-0 pt-12 sm:px-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:pt-16">
            <div className="min-w-0 pb-12 lg:pb-16">
              <p className="eyebrow text-brand-highlight">Olimpiada nacional de primaria</p>
              <h1 id="titulo-principal" className="mt-4 max-w-3xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                Matemáticas para imaginar, resolver y crecer
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/90">
                La Olimpiada Costarricense de Matemáticas para la Educación Primaria impulsa el talento y la resolución de problemas mediante una competencia sana entre estudiantes de todo el país.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a className="button-primary" href="#edicion-vigente">Ver edición 2026</a>
                <a className="button-secondary" href="#olimpiadas">Conocer OLCOMEP</a>
              </div>
            </div>
            <img
              alt="Niñas y niños que representan a la comunidad estudiantil de OLCOMEP"
              className="mx-auto min-w-0 max-w-full self-end"
              height="248"
              src="/assets/legacy/brand/ninos-olcomep.png"
              width="751"
            />
          </div>
        </section>

        <PhotoGallery />

        <section id="olimpiadas" className="scroll-mt-28 border-t border-line py-16 sm:py-20" aria-labelledby="sobre-olcomep">
          <div className="mx-auto grid max-w-content gap-10 px-5 sm:px-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="eyebrow text-brand-primary">Sobre la olimpiada</p>
              <h2 id="sobre-olcomep" className="section-title mt-3">Una competencia que conecta al país</h2>
            </div>
            <div className="max-w-3xl text-lg leading-8 text-slate-700">
              <p>OLCOMEP contribuye al mejoramiento de la calidad de la educación matemática en Costa Rica, estimulando y desarrollando las capacidades de resolución de problemas de niñas y niños.</p>
              <p className="mt-5">Participan estudiantes desde primer hasta sexto año diurno de la Educación General Básica, procedentes de distintas regiones educativas del país.</p>
            </div>
          </div>
        </section>

        <CurrentEdition />
        <Booklets2025 />
        <InteractiveBooklets />
        <HistoricalBooklets />
        <ContactSection />
      </main>

      <SiteFooter />
    </div>
  )
}

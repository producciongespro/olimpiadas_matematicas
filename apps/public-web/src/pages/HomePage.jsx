import { SiteFooter } from '../components/SiteFooter.jsx'
import { SiteHeader } from '../components/SiteHeader.jsx'
import { AboutUsSection } from '../features/about/AboutUsSection.jsx'
import { Booklets2025 } from '../features/booklets/Booklets2025.jsx'
import { HistoricalBooklets } from '../features/booklets/HistoricalBooklets.jsx'
import { CurrentEdition } from '../features/current-edition/CurrentEdition.jsx'
import { ContactSection } from '../features/contact/ContactSection.jsx'
import { PhotoGallery } from '../features/gallery/PhotoGallery.jsx'
import { InteractiveBooklets } from '../features/interactive-booklets/InteractiveBooklets.jsx'
import { MainCarousel } from '../features/carousel/MainCarousel.jsx'
import { GeneralInformationSection } from '../features/general-information/GeneralInformationSection.jsx'
import { RegionalCoordinationSection } from '../features/regional-coordination/RegionalCoordinationSection.jsx'

export function HomePage() {
  return (
    <div className="min-h-screen bg-white text-ink">
      <a className="skip-link" href="#contenido-principal">Saltar al contenido principal</a>
      <SiteHeader />

      <main id="contenido-principal">
        <MainCarousel />
        <section className="overflow-hidden bg-brand-primary text-white" aria-labelledby="titulo-principal">
          <div className="mx-auto grid max-w-content grid-cols-[minmax(0,1fr)] items-end gap-10 px-5 pb-0 pt-12 sm:px-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:pt-16">
            <div className="min-w-0 pb-12 lg:pb-16">
              <p className="eyebrow text-brand-highlight">OLCOMEP · Costa Rica</p>
              <h1 id="titulo-principal" className="mt-4 max-w-3xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                Olimpiada de Matemática para Primaria
              </h1>
              <p className="mt-5 inline-flex rounded-full border border-white/35 px-4 py-2 text-sm font-black uppercase tracking-[0.08em] text-white">
                Para estudiantes de 1.º a 6.º año
              </p>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/90">
                Imaginar, resolver y crecer mediante una competencia sana que impulsa el talento y la resolución de problemas en estudiantes de Educación Primaria de todo el país.
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

        <GeneralInformationSection />
        <PhotoGallery />

        <section id="olimpiadas" className="scroll-mt-28 border-t border-line py-16 sm:py-20" aria-labelledby="sobre-olcomep">
          <div className="mx-auto grid max-w-content gap-10 px-5 sm:px-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <img
                alt=""
                className="mb-7 h-auto w-36 sm:w-44 lg:w-48"
                height="690"
                loading="lazy"
                src="/logo-olcomep.png"
                width="690"
              />
              <p className="eyebrow text-brand-primary">Sobre la olimpiada</p>
              <h2 id="sobre-olcomep" className="section-title mt-3">Una competencia que conecta al país</h2>
            </div>
            <div className="max-w-3xl text-lg leading-8 text-slate-700">
              <p>OLCOMEP contribuye al mejoramiento de la calidad de la educación matemática en Costa Rica, estimulando y desarrollando las capacidades de resolución de problemas de niñas y niños.</p>
              <p className="mt-5">Participan estudiantes desde primer hasta sexto año diurno de la Educación General Básica, procedentes de distintas regiones educativas del país.</p>
            </div>
          </div>
        </section>

        <AboutUsSection />
        <RegionalCoordinationSection />
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

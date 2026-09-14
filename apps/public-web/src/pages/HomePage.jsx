import { SiteFooter } from '../components/SiteFooter.jsx'
import { SiteHeader } from '../components/SiteHeader.jsx'
import { AboutUsSection } from '../features/about/AboutUsSection.jsx'
import { Booklets2025 } from '../features/booklets/Booklets2025.jsx'
import { CalendarSection } from '../features/calendar/CalendarSection.jsx'
import { HistoricalBooklets } from '../features/booklets/HistoricalBooklets.jsx'
import { CurrentEdition } from '../features/current-edition/CurrentEdition.jsx'
import { ContactSection } from '../features/contact/ContactSection.jsx'
import { PhotoGallery } from '../features/gallery/PhotoGallery.jsx'
import { InteractiveBooklets } from '../features/interactive-booklets/InteractiveBooklets.jsx'
import { MainCarousel } from '../features/carousel/MainCarousel.jsx'
import { GeneralInformationSection } from '../features/general-information/GeneralInformationSection.jsx'
import { PartnersSection } from '../features/partners/PartnersSection.jsx'
import { RegionalCoordinationSection } from '../features/regional-coordination/RegionalCoordinationSection.jsx'

export function HomePage() {
  const [heroContent, setHeroContent] = useState(defaultHeroContent)

  useEffect(() => {
    let active = true
    createApiClient().siteHome()
      .then((sections) => {
        if (active && sections?.hero?.content) setHeroContent(mergeHeroContent(sections.hero.content))
      })
      .catch(() => {})
    return () => { active = false }
  }, [])

  return (
    <div className="min-h-screen bg-white text-ink">
      <a className="skip-link" href="#contenido-principal">Saltar al contenido principal</a>
      <SiteHeader />

      <main id="contenido-principal">
        <MainCarousel />
        <HeroSection content={heroContent} />

        <GeneralInformationSection />
        <CalendarSection />
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
        <PartnersSection />
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
import { createApiClient } from '@olcomep/api-client'
import { defaultHeroContent, mergeHeroContent } from '@olcomep/shared'
import { HeroSection } from '@olcomep/ui'
import { useEffect, useState } from 'react'

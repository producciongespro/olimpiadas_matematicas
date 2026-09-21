import { SiteFooter } from '../components/SiteFooter.jsx'
import { SiteHeader } from '../components/SiteHeader.jsx'
import { Booklets2025 } from '../features/booklets/Booklets2025.jsx'
import { HistoricalBooklets } from '../features/booklets/HistoricalBooklets.jsx'
import { PhotoGallery } from '../features/gallery/PhotoGallery.jsx'
import { InteractiveBooklets } from '../features/interactive-booklets/InteractiveBooklets.jsx'
import { MainCarousel } from '../features/carousel/MainCarousel.jsx'
import { AboutUsSection, CalendarSection, ContactSection, CurrentEditionSection, GeneralInformationSection, HeroSection, OlcomepIntroductionSection, PartnersSection, RegionalCoordinationSection } from '@olcomep/ui'
import { usePublishedSiteContent } from '../hooks/usePublishedSiteContent.js'

export function HomePage() {
  const { content } = usePublishedSiteContent()

  return (
    <div className="min-h-screen bg-white text-ink">
      <a className="skip-link" href="#contenido-principal">Saltar al contenido principal</a>
      <SiteHeader />

      <main id="contenido-principal">
        <MainCarousel />
        <HeroSection content={content.hero} />

        <GeneralInformationSection content={content['general-information']} />
        <CalendarSection content={content.calendar} />
        <PhotoGallery />

        <OlcomepIntroductionSection content={content['olcomep-introduction']} />

        <AboutUsSection content={content.about} />
        <PartnersSection content={content.partners} />
        <RegionalCoordinationSection content={content['regional-coordinations']} />
        <CurrentEditionSection content={content['current-edition']} />
        <Booklets2025 />
        <InteractiveBooklets />
        <HistoricalBooklets />
        <ContactSection content={content.contact} />
      </main>

      <SiteFooter />
    </div>
  )
}

import { PhotoGallery } from '../features/gallery/PhotoGallery.jsx'
import { MainCarousel } from '../features/carousel/MainCarousel.jsx'
import { AboutUsSection, CalendarSection, ContactSection, CurrentEditionSection, GeneralInformationSection, HeroSection, OlcomepIntroductionSection, PartnersSection, RegionalCoordinationSection, ResourceBookletsSection, SiteHeader, SiteFooter } from '@olcomep/ui'
import { usePublishedSiteContent } from '../hooks/usePublishedSiteContent.js'

export function HomePage() {
  const { content } = usePublishedSiteContent()

  return (
    <div className="min-h-screen bg-white text-ink">
      <a className="skip-link" href="#contenido-principal">Saltar al contenido principal</a>
      <SiteHeader content={content['site-header']} currentEdition={content['current-edition']} />

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
        <ResourceBookletsSection content={content['resource-booklets']} />
        <ContactSection content={content.contact} />
      </main>

      <SiteFooter content={content['site-footer']} />
    </div>
  )
}

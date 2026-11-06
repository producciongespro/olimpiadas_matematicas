import { defaultSiteHeaderContent } from '@olcomep/shared'
import { PhotoGallery } from '../features/gallery/PhotoGallery.jsx'
import { MainCarousel } from '../features/carousel/MainCarousel.jsx'
import { AboutUsSection, CalendarSection, ContactSection, CurrentEditionSection, GeneralInformationSection, HeroSection, OlcomepIntroductionSection, PartnersSection, RegionalCoordinationSection, ResourceBookletsSection, SiteHeader, SiteFooter } from '@olcomep/ui'
import { usePublishedSiteContent } from '../hooks/usePublishedSiteContent.js'

export function HomePage() {
  const { content, initialLoading, version } = usePublishedSiteContent()
  const currentEdition = content['current-edition']

  return (
    <div className="olcomep-site min-h-screen bg-white text-ink">
      <a className="skip-link" href="#contenido-principal">Saltar al contenido principal</a>
      <SiteHeader content={defaultSiteHeaderContent} currentEdition={version ? currentEdition : undefined} />

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
        {initialLoading ? (
          <section id="edicion-vigente" aria-labelledby="titulo-edicion" aria-busy="true" className="scroll-mt-28 bg-brand-soft py-16 sm:py-20">
            <div className="mx-auto max-w-content px-5 sm:px-8">
              <h2 className="section-title" id="titulo-edicion">Edición vigente</h2>
              <p className="mt-5" role="status">Cargando información de la edición…</p>
            </div>
          </section>
        ) : <CurrentEditionSection content={currentEdition} />}
        <ResourceBookletsSection content={content['resource-booklets']} />
        <ContactSection content={content.contact} />
      </main>

      <SiteFooter content={content['site-footer']} />
    </div>
  )
}

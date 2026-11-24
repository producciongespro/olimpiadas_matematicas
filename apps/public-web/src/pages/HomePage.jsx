import { defaultSiteHeaderContent } from '@olcomep/shared'
import { PhotoGallery } from '../features/gallery/PhotoGallery.jsx'
import { MainCarousel } from '../features/carousel/MainCarousel.jsx'
import { AboutUsSection, CalendarSection, ContactSection, CurrentEditionSection, GeneralInformationSection, HeroSection, OlcomepIntroductionSection, PartnersSection, RegionalCoordinationSection, ResourceBookletsSection, SiteHeader, SiteFooter } from '@olcomep/ui'
import { usePublishedSiteContent } from '../hooks/usePublishedSiteContent.js'
import { PublicTaskNavigation } from '../components/PublicTaskNavigation.jsx'
import { HowToParticipateSection } from '../components/HowToParticipateSection.jsx'

export function HomePage() {
  const { content, footerLoaded, initialLoading, error, version } = usePublishedSiteContent()
  const currentEdition = content['current-edition']
  const logoUrl = content['institutional-identity']?.logo_url || '/logo-olcomep.png'
  const mepLogoUrl = content['institutional-identity']?.mep_logo_url || '/logotipo%20MEP.png'

  return (
    <div className="olcomep-site min-h-screen bg-white text-ink">
      <a className="skip-link" href="#contenido-principal">Saltar al contenido principal</a>
      <SiteHeader content={defaultSiteHeaderContent} currentEdition={version ? currentEdition : undefined} calificameHref={content.contact?.resources?.find((item) => item.key === 'calificame')?.href} logoUrl={logoUrl} mepLogoUrl={mepLogoUrl} />

      <main id="contenido-principal">
        <MainCarousel />
        <HeroSection content={content.hero} />
        <PublicTaskNavigation />
        <HowToParticipateSection currentEdition={currentEdition} loading={initialLoading} />
        <CalendarSection content={content.calendar} />
        <GeneralInformationSection content={content['general-information']} />
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
        <PhotoGallery />
        <OlcomepIntroductionSection content={content['olcomep-introduction']} logoUrl={logoUrl} />
        <AboutUsSection content={content.about} />
        <PartnersSection content={content.partners} />
        <ContactSection content={content.contact} />
      </main>

      {footerLoaded ? <SiteFooter content={content['site-footer']} logoUrl={logoUrl} mepLogoUrl={mepLogoUrl} /> : <footer className="bg-slate-950 px-5 py-10 text-center text-sm text-white" role="status">{initialLoading ? 'Cargando información institucional…' : error ? 'No fue posible cargar la información institucional.' : 'Información institucional no disponible.'}</footer>}
    </div>
  )
}

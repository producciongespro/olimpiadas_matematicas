import { SiteFooter } from '../components/SiteFooter.jsx'
import { SiteHeader } from '../components/SiteHeader.jsx'
import { Booklets2025 } from '../features/booklets/Booklets2025.jsx'
import { HistoricalBooklets } from '../features/booklets/HistoricalBooklets.jsx'
import { ContactSection } from '../features/contact/ContactSection.jsx'
import { PhotoGallery } from '../features/gallery/PhotoGallery.jsx'
import { InteractiveBooklets } from '../features/interactive-booklets/InteractiveBooklets.jsx'
import { MainCarousel } from '../features/carousel/MainCarousel.jsx'
import { createApiClient } from '@olcomep/api-client'
import { defaultAboutContent, defaultCalendarContent, defaultCurrentEditionContent, defaultGeneralInformationContent, defaultHeroContent, defaultOlcomepIntroductionContent, defaultPartnersContent, defaultRegionalCoordinationsContent, mergeAboutContent, mergeCalendarContent, mergeCurrentEditionContent, mergeGeneralInformationContent, mergeHeroContent, mergeOlcomepIntroductionContent, mergePartnersContent, mergeRegionalCoordinationsContent } from '@olcomep/shared'
import { AboutUsSection, CalendarSection, CurrentEditionSection, GeneralInformationSection, HeroSection, OlcomepIntroductionSection, PartnersSection, RegionalCoordinationSection } from '@olcomep/ui'
import { useEffect, useState } from 'react'

export function HomePage() {
  const [heroContent, setHeroContent] = useState(defaultHeroContent)
  const [introductionContent, setIntroductionContent] = useState(defaultOlcomepIntroductionContent)
  const [calendarContent, setCalendarContent] = useState(defaultCalendarContent)
  const [partnersContent, setPartnersContent] = useState(defaultPartnersContent)
  const [aboutContent, setAboutContent] = useState(defaultAboutContent)
  const [generalInformationContent, setGeneralInformationContent] = useState(defaultGeneralInformationContent)
  const [regionalContent, setRegionalContent] = useState(defaultRegionalCoordinationsContent)
  const [currentEditionContent, setCurrentEditionContent] = useState(defaultCurrentEditionContent)

  useEffect(() => {
    let active = true
    createApiClient().siteHome()
      .then((sections) => {
        if (active && sections?.hero?.content) setHeroContent(mergeHeroContent(sections.hero.content))
        if (active && sections?.['olcomep-introduction']?.content) setIntroductionContent(mergeOlcomepIntroductionContent(sections['olcomep-introduction'].content))
        if (active && sections?.calendar?.content) setCalendarContent(mergeCalendarContent(sections.calendar.content))
        if (active && sections?.partners?.content) setPartnersContent(mergePartnersContent(sections.partners.content))
        if (active && sections?.about?.content) setAboutContent(mergeAboutContent(sections.about.content))
        if (active && sections?.['general-information']?.content) setGeneralInformationContent(mergeGeneralInformationContent(sections['general-information'].content))
        if (active && sections?.['regional-coordinations']?.content) setRegionalContent(mergeRegionalCoordinationsContent(sections['regional-coordinations'].content))
        if (active && sections?.['current-edition']?.content) setCurrentEditionContent(mergeCurrentEditionContent(sections['current-edition'].content))
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

        <GeneralInformationSection content={generalInformationContent} />
        <CalendarSection content={calendarContent} />
        <PhotoGallery />

        <OlcomepIntroductionSection content={introductionContent} />

        <AboutUsSection content={aboutContent} />
        <PartnersSection content={partnersContent} />
        <RegionalCoordinationSection content={regionalContent} />
        <CurrentEditionSection content={currentEditionContent} />
        <Booklets2025 />
        <InteractiveBooklets />
        <HistoricalBooklets />
        <ContactSection />
      </main>

      <SiteFooter />
    </div>
  )
}

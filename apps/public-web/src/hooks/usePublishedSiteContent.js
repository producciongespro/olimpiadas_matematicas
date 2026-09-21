import { createApiClient } from '@olcomep/api-client'
import {
  defaultAboutContent,
  defaultCalendarContent,
  defaultContactContent,
  defaultCurrentEditionContent,
  defaultGeneralInformationContent,
  defaultHeroContent,
  defaultOlcomepIntroductionContent,
  defaultPartnersContent,
  defaultRegionalCoordinationsContent,
  mergeAboutContent,
  mergeCalendarContent,
  mergeContactContent,
  mergeCurrentEditionContent,
  mergeGeneralInformationContent,
  mergeHeroContent,
  mergeOlcomepIntroductionContent,
  mergePartnersContent,
  mergeRegionalCoordinationsContent,
} from '@olcomep/shared'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const REFRESH_INTERVAL_MS = 30_000

const sectionDefinitions = {
  hero: { fallback: defaultHeroContent, merge: mergeHeroContent },
  'olcomep-introduction': { fallback: defaultOlcomepIntroductionContent, merge: mergeOlcomepIntroductionContent },
  calendar: { fallback: defaultCalendarContent, merge: mergeCalendarContent },
  partners: { fallback: defaultPartnersContent, merge: mergePartnersContent },
  about: { fallback: defaultAboutContent, merge: mergeAboutContent },
  'general-information': { fallback: defaultGeneralInformationContent, merge: mergeGeneralInformationContent },
  'regional-coordinations': { fallback: defaultRegionalCoordinationsContent, merge: mergeRegionalCoordinationsContent },
  'current-edition': { fallback: defaultCurrentEditionContent, merge: mergeCurrentEditionContent },
  contact: { fallback: defaultContactContent, merge: mergeContactContent },
}

const initialContent = Object.fromEntries(
  Object.entries(sectionDefinitions).map(([key, definition]) => [key, definition.fallback]),
)

export function mergePublishedSiteContent(currentContent, sections) {
  if (!sections || typeof sections !== 'object') return currentContent

  return Object.entries(sectionDefinitions).reduce((nextContent, [key, definition]) => {
    const publishedContent = sections[key]?.content
    if (publishedContent) nextContent[key] = definition.merge(publishedContent)
    return nextContent
  }, { ...currentContent })
}

export function usePublishedSiteContent() {
  const api = useMemo(() => createApiClient(), [])
  const mounted = useRef(true)
  const requestSequence = useRef(0)
  const etag = useRef(null)
  const inFlight = useRef(null)
  const [content, setContent] = useState(initialContent)
  const [status, setStatus] = useState({ initialLoading: true, refreshing: false, error: null, version: null })

  const refresh = useCallback(() => {
    if (inFlight.current) return inFlight.current
    const requestId = ++requestSequence.current
    setStatus((current) => ({
      initialLoading: current.initialLoading,
      refreshing: !current.initialLoading,
      error: null,
      version: current.version,
    }))

    const request = api.siteHome({ etag: etag.current })
      .then((result) => {
        if (!mounted.current || requestId !== requestSequence.current) return
        etag.current = result.etag
        if (!result.notModified) setContent((current) => mergePublishedSiteContent(current, result.sections))
        setStatus((current) => ({
          initialLoading: false,
          refreshing: false,
          error: null,
          version: result.version || current.version,
        }))
      })
      .catch((error) => {
        if (!mounted.current || requestId !== requestSequence.current) return
        setStatus((current) => ({
          initialLoading: false,
          refreshing: false,
          error: error instanceof Error ? error : new Error('No fue posible actualizar el contenido público.'),
          version: current.version,
        }))
      })
      .finally(() => {
        if (inFlight.current === request) inFlight.current = null
      })

    inFlight.current = request
    return request
  }, [api])

  useEffect(() => {
    mounted.current = true
    refresh()
    return () => {
      mounted.current = false
      requestSequence.current += 1
      inFlight.current = null
    }
  }, [refresh])

  useEffect(() => {
    let intervalId = null

    const stopInterval = () => {
      if (intervalId !== null) window.clearInterval(intervalId)
      intervalId = null
    }
    const startInterval = () => {
      stopInterval()
      if (document.visibilityState === 'visible') intervalId = window.setInterval(refresh, REFRESH_INTERVAL_MS)
    }
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') refresh()
      startInterval()
    }
    const handleFocus = () => {
      if (document.visibilityState === 'visible') refresh()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    startInterval()

    return () => {
      stopInterval()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [refresh])

  return { content, ...status, refresh }
}

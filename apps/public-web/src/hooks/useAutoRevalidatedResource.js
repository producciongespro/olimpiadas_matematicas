import { useCallback, useEffect, useRef, useState } from 'react'

const REFRESH_INTERVAL_MS = 30_000

export function useAutoRevalidatedResource({ load, initialData, resourceKey = 'default', enabled = true }) {
  const mounted = useRef(true)
  const requestSequence = useRef(0)
  const etag = useRef(null)
  const inFlight = useRef(null)
  const [data, setData] = useState(initialData)
  const [status, setStatus] = useState('loading')

  const refresh = useCallback(() => {
    if (!enabled) return Promise.resolve()
    if (inFlight.current) return inFlight.current
    const requestId = ++requestSequence.current

    const request = load({ etag: etag.current })
      .then((result) => {
        if (!mounted.current || requestId !== requestSequence.current) return
        etag.current = result.etag
        if (!result.notModified) setData(result.data)
        setStatus('success')
      })
      .catch(() => {
        if (!mounted.current || requestId !== requestSequence.current) return
        setStatus('error')
      })
      .finally(() => {
        if (inFlight.current === request) inFlight.current = null
      })

    inFlight.current = request
    return request
  }, [enabled, load])

  useEffect(() => {
    mounted.current = true
    etag.current = null
    inFlight.current = null
    setData(initialData)
    setStatus(enabled ? 'loading' : 'success')
    if (enabled) refresh()
    return () => {
      mounted.current = false
      requestSequence.current += 1
      inFlight.current = null
    }
  }, [enabled, initialData, refresh, resourceKey])

  useEffect(() => {
    if (!enabled) return undefined
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
  }, [enabled, refresh])

  return { data, status, refresh }
}

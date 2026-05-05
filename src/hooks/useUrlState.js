import { useEffect, useRef } from 'react'

export function useUrlState(tab, values) {
  const timerRef = useRef(null)
  const valStr = JSON.stringify(values)

  useEffect(() => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams()
      params.set('tab', tab)
      Object.entries(values).forEach(([k, v]) => {
        params.set(k, String(v))
      })
      window.history.replaceState(null, '', `?${params.toString()}`)
    }, 300)
    return () => clearTimeout(timerRef.current)
  }, [tab, valStr])
}

export function getUrlParam(key, fallback) {
  const params = new URLSearchParams(window.location.search)
  const raw = params.get(key)
  if (raw === null) return fallback
  const num = parseFloat(raw)
  if (!isNaN(num)) return num
  return raw
}

export function getUrlTab() {
  const params = new URLSearchParams(window.location.search)
  return params.get('tab') || null
}

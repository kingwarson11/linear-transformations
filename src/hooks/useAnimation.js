import { useRef, useCallback, useState, useEffect } from 'react'

export function useAnimation({ setValue, min, max, speed = 0.8 }) {
  const [playing, setPlaying] = useState(false)
  const rafRef = useRef(null)
  const stateRef = useRef({ val: min, dir: 1, playing: false })

  const stop = useCallback(() => {
    stateRef.current.playing = false
    setPlaying(false)
    cancelAnimationFrame(rafRef.current)
  }, [])

  const start = useCallback((currentVal) => {
    stateRef.current.val = currentVal
    stateRef.current.playing = true
    setPlaying(true)

    const tick = () => {
      if (!stateRef.current.playing) return
      stateRef.current.val += speed * stateRef.current.dir

      if (stateRef.current.val >= max) {
        stateRef.current.val = max
        stateRef.current.dir = -1
      }
      if (stateRef.current.val <= min) {
        stateRef.current.val = min
        stateRef.current.dir = 1
      }

      setValue(Math.round(stateRef.current.val * 10) / 10)
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [setValue, min, max, speed])

  const toggle = useCallback((currentVal) => {
    if (stateRef.current.playing) stop()
    else start(currentVal)
  }, [start, stop])

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  return { playing, toggle, stop }
}

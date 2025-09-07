import { useState, useEffect } from "react"

/** @typedef {import("react").Dispatch<import("react").SetStateAction<any>>} Dispatch */

/**
 * Hook para acessar câmera e microfone
 */
export function useUserMedia(defaultConstraints = { video: true, audio: true }) {
  /** @type {[MediaStream|null, Dispatch]} */
  const [stream, setStream] = useState(null)

  /** @type {[Error|null, Dispatch]} */
  const [error, setError] = useState(null)

  const start = async (constraints = defaultConstraints) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError(new Error("Seu navegador não suporta câmera/microfone"))
      return null
    }

    stop() // para qualquer stream antigo

    try {
      const s = await navigator.mediaDevices.getUserMedia(constraints)
      setStream(s)
      setError(null)
      return s
    } catch (e) {
      setError(e)
      return null
    }
  }

  const stop = () => {
    setStream(prev => {
      if (prev) prev.getTracks().forEach(track => track.stop())
      return null
    })
  }

  useEffect(() => () => stop(), [])

  return { stream, start, stop, error }
}

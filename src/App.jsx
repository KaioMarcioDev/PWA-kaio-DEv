import { useRef, useEffect, useState } from "react"
import { useUserMedia } from "./useUserMedia"

export default function App() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [photoURL, setPhotoURL] = useState(null)
  const [audioURL, setAudioURL] = useState(null)
  const [recording, setRecording] = useState(false)
  const recorderRef = useRef(null)

  const { stream, start, stop, error } = useUserMedia({ video: true, audio: true })

  // vincula stream ao video
  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream
  }, [stream])

  // tirar foto
  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height)
    setPhotoURL(canvas.toDataURL("image/png"))
  }

  // iniciar gravação de áudio
  const startRecording = () => {
    if (!stream) return
    if (!window.MediaRecorder) {
      alert("Gravação não suportada nesse dispositivo")
      return
    }

    try {
      const rec = new MediaRecorder(stream, { mimeType: "audio/webm" })
      recorderRef.current = rec
      const chunks = []

      rec.ondataavailable = e => {
        if (e.data.size > 0) chunks.push(e.data)
      }

      rec.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" })
        setAudioURL(URL.createObjectURL(blob))
        setRecording(false)
      }

      rec.start()
      setRecording(true)
    } catch (e) {
      alert("Erro ao iniciar gravação: " + e.message)
    }
  }

  // parar gravação de áudio
  const stopRecording = () => {
    recorderRef.current?.stop()
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>PWA Câmera + Microfone</h1>

      {error && <p style={{ color: "red" }}>{error.message}</p>}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ width: "100%", maxWidth: 400, borderRadius: 8, border: "1px solid #ccc" }}
      />

      <div style={{ marginTop: 10 }}>
        <button onClick={() => start()}>Abrir Câmera/Microfone</button>
        <button onClick={() => stop()} style={{ marginLeft: 10 }}>Parar</button>
        <button onClick={takePhoto} style={{ marginLeft: 10 }} disabled={!stream}>Tirar Foto</button>
      </div>

      <div style={{ marginTop: 10 }}>
        {!recording && <button onClick={startRecording} disabled={!stream}>Gravar Áudio</button>}
        {recording && <button onClick={stopRecording}>Parar Gravação</button>}
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {photoURL && (
        <div style={{ marginTop: 20 }}>
          <h3>Foto:</h3>
          <img src={photoURL} alt="captura" style={{ width: "100%", maxWidth: 400 }} />
          <a download="foto.png" href={photoURL}>Baixar Foto</a>
        </div>
      )}

      {audioURL && (
        <div style={{ marginTop: 20 }}>
          <h3>Áudio gravado:</h3>
          <audio controls src={audioURL} />
          <a download="audio.webm" href={audioURL}>Baixar Áudio</a>
        </div>
      )}
    </div>
  )
}

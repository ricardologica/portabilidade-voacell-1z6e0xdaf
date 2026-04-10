import { useState, useRef, useEffect } from 'react'
import { Camera, Square, Play, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PortabilityFormData } from '../index'

export default function Step5({
  data,
  update,
}: {
  data: PortabilityFormData
  update: (d: Partial<PortabilityFormData>) => void
}) {
  const [status, setStatus] = useState<'idle' | 'recording' | 'recorded'>(
    data.video_auth_file ? 'recorded' : 'idle',
  )
  const [timer, setTimer] = useState(0)
  const [videoURL, setVideoURL] = useState<string | null>(
    data.video_auth_file ? URL.createObjectURL(data.video_auth_file) : null,
  )

  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (videoURL) URL.revokeObjectURL(videoURL)
    }
  }, [videoURL])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: true,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.muted = true
      }

      chunksRef.current = []

      const types = ['video/webm;codecs=vp9,opus', 'video/webm', 'video/mp4']
      let options = {}
      for (const t of types) {
        if (MediaRecorder.isTypeSupported(t)) {
          options = { mimeType: t }
          break
        }
      }

      const mediaRecorder = new MediaRecorder(stream, options)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || 'video/mp4'
        const blob = new Blob(chunksRef.current, { type: mimeType })
        const url = URL.createObjectURL(blob)
        setVideoURL(url)

        const ext = mimeType.includes('webm') ? 'webm' : 'mp4'
        const file = new File([blob], `video_auth_${Date.now()}.${ext}`, { type: mimeType })
        update({ video_auth_file: file })

        stream.getTracks().forEach((track) => track.stop())
        if (videoRef.current) videoRef.current.srcObject = null
      }

      mediaRecorder.start()
      setStatus('recording')
      setTimer(0)
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000)
    } catch (err) {
      console.error('MediaRecorder error:', err)
      alert(
        'Não foi possível iniciar a gravação. Verifique as permissões de câmera e microfone no seu navegador.',
      )
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && status === 'recording') {
      mediaRecorderRef.current.stop()
      setStatus('recorded')
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }

  const reset = () => {
    setStatus('idle')
    if (videoURL) URL.revokeObjectURL(videoURL)
    setVideoURL(null)
    update({ video_auth_file: null })
  }

  const formatTime = (s: number) => `00:${s.toString().padStart(2, '0')}`

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-md text-sm">
        <p className="font-semibold mb-2">Instruções para Gravação:</p>
        <p>1. Posicione seu rosto no centro da câmera.</p>
        <p>2. Segure seu documento de identidade (RG ou CNH) ao lado do rosto.</p>
        <p>3. Leia a frase abaixo em voz alta durante o vídeo.</p>
      </div>

      <div className="bg-slate-100 p-4 rounded-lg text-center border shadow-inner">
        <p className="text-lg font-medium text-secondary">
          "Meu nome é{' '}
          <span className="underline decoration-primary decoration-2 underline-offset-2">
            {data.titular_name || '[Seu Nome]'}
          </span>{' '}
          e autorizo minha portabilidade da Operadora{' '}
          <span className="underline decoration-primary decoration-2 underline-offset-2">
            {data.origin_operator || '[Origem]'}
          </span>{' '}
          para a Operadora Voacell com o documento na mão."
        </p>
      </div>

      <div className="relative aspect-[4/3] sm:aspect-video bg-slate-900 rounded-xl overflow-hidden flex flex-col items-center justify-center border-4 border-slate-800">
        {status === 'idle' && (
          <div className="flex flex-col items-center text-slate-400 p-6 text-center">
            <Camera className="h-16 w-16 mb-4 opacity-50" />
            <p>Clique em "Iniciar Gravação" para ativar a câmera</p>
          </div>
        )}

        {status === 'recording' && (
          <div className="absolute inset-0 border-4 border-red-500/50 rounded-lg pointer-events-none animate-pulse-fast z-10" />
        )}

        {(status === 'recording' || status === 'idle') && !videoURL && (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-cover ${status === 'idle' ? 'opacity-0' : 'opacity-100'}`}
          />
        )}

        {status === 'recording' && (
          <div className="absolute top-4 left-0 right-0 flex justify-center z-10">
            <div className="flex items-center bg-black/50 text-white px-3 py-1 rounded-full backdrop-blur shadow-lg">
              <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse mr-2" />
              <span className="font-mono">{formatTime(timer)}</span>
            </div>
          </div>
        )}

        {status === 'recorded' && videoURL && (
          <video
            src={videoURL}
            controls
            playsInline
            className="absolute inset-0 w-full h-full object-contain bg-black"
          />
        )}
      </div>

      <div className="flex justify-center gap-4">
        {status === 'idle' && (
          <Button
            onClick={startRecording}
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8 shadow-md"
          >
            <Camera className="mr-2 h-5 w-5" /> Iniciar Gravação
          </Button>
        )}
        {status === 'recording' && (
          <Button
            onClick={stopRecording}
            size="lg"
            variant="destructive"
            className="rounded-full px-8 shadow-lg z-20"
          >
            <Square className="mr-2 h-5 w-5 fill-current" /> Parar Gravação
          </Button>
        )}
        {status === 'recorded' && (
          <Button onClick={reset} variant="outline" size="lg" className="rounded-full px-8">
            <RefreshCw className="mr-2 h-5 w-5" /> Gravar Novamente
          </Button>
        )}
      </div>
    </div>
  )
}

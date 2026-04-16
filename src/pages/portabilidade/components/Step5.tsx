import { useState, useRef, useEffect, useCallback } from 'react'
import { Camera, Square, RefreshCw, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { PortabilityFormData } from '../index'

const MAX_RECORDING_SECONDS = 15

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
  const getVideoUrl = useCallback(() => {
    if (data.video_auth_file instanceof File) {
      return URL.createObjectURL(data.video_auth_file)
    } else if (typeof data.video_auth_file === 'string' && data.id) {
      return pb.files.getUrl(
        { collectionId: 'portability_requests', id: data.id } as any,
        data.video_auth_file,
      )
    }
    return null
  }, [data.video_auth_file, data.id])

  const [videoURL, setVideoURL] = useState<string | null>(getVideoUrl())

  useEffect(() => {
    setVideoURL(getVideoUrl())
  }, [getVideoUrl])
  const [error, setError] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop()
      } catch (err) {
        console.error('Error stopping MediaRecorder:', err)
      }
      setStatus('recorded')
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (status === 'recording' && timer >= MAX_RECORDING_SECONDS) {
      stopRecording()
    }
  }, [timer, status, stopRecording])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  useEffect(() => {
    return () => {
      if (videoURL) URL.revokeObjectURL(videoURL)
    }
  }, [videoURL])

  const startRecording = async () => {
    setError(null)
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
          'Seu navegador não suporta gravação de vídeo ou não está em um contexto seguro (HTTPS).',
        )
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: true,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.muted = true
      }

      chunksRef.current = []

      const types = ['video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4']
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
        try {
          const rawMimeType = mediaRecorder.mimeType || 'video/mp4'
          const baseMimeType = rawMimeType.split(';')[0]

          const allowedMimes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska']
          const finalMime = allowedMimes.includes(baseMimeType) ? baseMimeType : 'video/mp4'

          let ext = 'mp4'
          if (finalMime === 'video/webm') ext = 'webm'
          else if (finalMime === 'video/quicktime') ext = 'mov'
          else if (finalMime === 'video/x-matroska') ext = 'mkv'

          const blob = new Blob(chunksRef.current, { type: finalMime })

          if (blob.size === 0) {
            throw new Error('Vídeo gravado está vazio. Tente novamente.')
          }

          const url = URL.createObjectURL(blob)
          setVideoURL(url)

          const file = new File([blob], `video_auth_${Date.now()}.${ext}`, { type: finalMime })
          update({ video_auth_file: file })
        } catch (err: any) {
          console.error('Error processing recorded video:', err)
          setError(`Falha ao processar o vídeo gravado: ${err.message}`)
          setStatus('idle')
        } finally {
          stream.getTracks().forEach((track) => {
            track.stop()
            stream.removeTrack(track)
          })
          if (videoRef.current) {
            videoRef.current.srcObject = null
          }
        }
      }

      mediaRecorder.start()
      setStatus('recording')
      setTimer(0)
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000)
    } catch (err: any) {
      console.error('MediaRecorder initialization error:', err)
      let errorMessage =
        'Não foi possível iniciar a gravação. Verifique as permissões de câmera e microfone no seu navegador.'

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage =
          'Permissão de câmera/microfone negada. Por favor, libere o acesso nas configurações do seu navegador (ícone de cadeado na barra de endereços).'
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage =
          'Nenhuma câmera ou microfone encontrado no seu dispositivo. Verifique se estão conectados corretamente.'
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage =
          'Sua câmera ou microfone já está em uso por outro aplicativo ou aba do navegador. Feche-os e tente novamente.'
      } else if (
        err.name === 'OverconstrainedError' ||
        err.name === 'ConstraintNotSatisfiedError'
      ) {
        errorMessage = 'Sua câmera não suporta as configurações solicitadas.'
      } else {
        errorMessage = `Erro desconhecido ao acessar mídia: ${err.message || err.name || 'Erro interno'}.`
      }

      setError(errorMessage)
      setStatus('idle')
    }
  }

  const reset = () => {
    setStatus('idle')
    if (videoURL) URL.revokeObjectURL(videoURL)
    setVideoURL(null)
    setError(null)
    setTimer(0)
    update({ video_auth_file: null })
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
  }

  const formatTime = (s: number) => `00:${s.toString().padStart(2, '0')}`

  return (
    <div className="space-y-6 animate-fade-in">
      {error && (
        <Alert variant="destructive" className="animate-fade-in-down">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Permissão Necessária</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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
            {data.representative_name || data.titular_name || '[Nome do Titular]'}
          </span>{' '}
          e autorizo minha portabilidade da Operadora{' '}
          <span className="underline decoration-primary decoration-2 underline-offset-2">
            {data.origin_operator || '[Operadora de Origem]'}
          </span>{' '}
          para a Operadora Voacell com posse do documento na mão."
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
              <span className="font-mono">
                {formatTime(timer)} / {formatTime(MAX_RECORDING_SECONDS)}
              </span>
            </div>
          </div>
        )}

        {status === 'recorded' && videoURL && (
          <video
            src={videoURL}
            controls
            playsInline
            controlsList="nodownload"
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

      <div className="pt-4 border-t mt-6 flex items-start space-x-3 p-4 bg-slate-50 border rounded-lg">
        <Checkbox
          id="invoice_up_to_date"
          checked={data.invoice_up_to_date}
          onCheckedChange={(checked) => update({ invoice_up_to_date: checked === true })}
          className="mt-1"
        />
        <Label
          htmlFor="invoice_up_to_date"
          className="text-sm font-medium leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          Declaro que a fatura está em dia para evitar bloqueios no procedimento. *
        </Label>
      </div>
    </div>
  )
}

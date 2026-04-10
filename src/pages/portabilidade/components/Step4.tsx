import { useState, useRef } from 'react'
import { Camera, Square, Play, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormData } from '../index'

export default function Step4({
  data,
  update,
}: {
  data: FormData
  update: (d: Partial<FormData>) => void
}) {
  const [status, setStatus] = useState<'idle' | 'recording' | 'recorded'>(
    data.videoAuthorized ? 'recorded' : 'idle',
  )
  const [timer, setTimer] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = () => {
    setStatus('recording')
    setTimer(0)
    intervalRef.current = setInterval(() => setTimer((t) => t + 1), 1000)
  }

  const stopRecording = () => {
    setStatus('recorded')
    if (intervalRef.current) clearInterval(intervalRef.current)
    update({ videoAuthorized: true })
  }

  const reset = () => {
    setStatus('idle')
    update({ videoAuthorized: false })
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
            {data.ownerName || '[Nome]'}
          </span>{' '}
          e autorizo minha portabilidade da Operadora{' '}
          <span className="underline decoration-primary decoration-2 underline-offset-2">
            {data.currentOperator || '[Operadora]'}
          </span>{' '}
          para a Operadora Voacell com posse do documento na mão."
        </p>
      </div>

      <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden flex flex-col items-center justify-center border-4 border-slate-800">
        {status === 'idle' && (
          <div className="flex flex-col items-center text-slate-400">
            <Camera className="h-16 w-16 mb-4 opacity-50" />
            <p>Câmera Simulada</p>
          </div>
        )}

        {status === 'recording' && (
          <div className="absolute inset-0 border-4 border-red-500/50 rounded-lg pointer-events-none animate-pulse-fast" />
        )}

        {status === 'recording' && (
          <div className="flex flex-col items-center">
            <div className="flex items-center bg-black/50 text-white px-3 py-1 rounded-full mb-4 backdrop-blur">
              <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse mr-2" />
              <span className="font-mono">{formatTime(timer)}</span>
            </div>
            <img
              src="https://img.usecurling.com/ppl/medium?gender=male"
              alt="Simulated Face"
              className="w-32 h-32 rounded-full object-cover border-2 border-white/20"
            />
          </div>
        )}

        {status === 'recorded' && (
          <div className="flex flex-col items-center text-white bg-black/60 w-full h-full justify-center backdrop-blur-sm">
            <Play className="h-16 w-16 mb-2 opacity-80" />
            <p className="font-medium text-lg">Vídeo Gravado com Sucesso</p>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4">
        {status === 'idle' && (
          <Button
            onClick={startRecording}
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8"
          >
            <Camera className="mr-2 h-5 w-5" /> Iniciar Gravação
          </Button>
        )}
        {status === 'recording' && (
          <Button
            onClick={stopRecording}
            size="lg"
            variant="destructive"
            className="rounded-full px-8 shadow-lg"
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

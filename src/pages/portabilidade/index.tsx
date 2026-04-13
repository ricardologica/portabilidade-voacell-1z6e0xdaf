import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAppStore from '@/stores/useAppStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import pb from '@/lib/pocketbase/client'
import { getErrorMessage } from '@/lib/pocketbase/errors'

import Step1 from './components/Step1'
import Step2 from './components/Step2'
import Step3 from './components/Step3'
import Step4 from './components/Step4'
import Step5 from './components/Step5'

export interface PortabilityFormData {
  invoice_file: File | null
  state: string
  city: string
  origin_operator: string
  numbers: string
  titular_name: string
  titular_document: string
  document_file: File | null
  video_auth_file: File | null
  invoice_up_to_date: boolean
}

const INITIAL_DATA: PortabilityFormData = {
  invoice_file: null,
  state: '',
  city: '',
  origin_operator: '',
  numbers: '',
  titular_name: '',
  titular_document: '',
  document_file: null,
  video_auth_file: null,
  invoice_up_to_date: false,
}

export default function PortabilidadePage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<PortabilityFormData>(INITIAL_DATA)
  const [loading, setLoading] = useState(false)
  const { user } = useAppStore()
  const navigate = useNavigate()
  const { toast } = useToast()

  const updateData = (fields: Partial<PortabilityFormData>) =>
    setFormData((prev) => ({ ...prev, ...fields }))

  const handleNext = () => setStep((s) => Math.min(s + 1, 5))
  const handleBack = () => setStep((s) => Math.max(s - 1, 1))

  const canProceed = () => {
    if (step === 1) return !!formData.invoice_file
    if (step === 2) return !!formData.state && !!formData.city && !!formData.origin_operator
    if (step === 3)
      return !!formData.numbers.trim() && !!formData.titular_name && !!formData.titular_document
    if (step === 4) return !!formData.document_file
    if (step === 5) return !!formData.video_auth_file && formData.invoice_up_to_date
    return true
  }

  const handleSubmit = async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = new FormData()
      data.append('user_id', user.id)
      data.append('state', formData.state)
      data.append('city', formData.city)
      data.append('origin_operator', formData.origin_operator)
      data.append('numbers', formData.numbers)
      data.append('titular_name', formData.titular_name)
      data.append('titular_document', formData.titular_document)
      data.append('status', 'pending')

      if (formData.invoice_file) data.append('invoice_file', formData.invoice_file)
      if (formData.document_file) data.append('document_file', formData.document_file)
      if (formData.video_auth_file) data.append('video_auth_file', formData.video_auth_file)

      await pb.collection('portability_requests').create(data)

      toast({
        title: 'Solicitação Enviada!',
        description: 'Sua portabilidade foi registrada com sucesso.',
      })
      navigate('/cliente')
    } catch (err: any) {
      console.error('Falha ao criar solicitação de portabilidade:', err)
      toast({
        title: 'Erro ao enviar solicitação',
        description: getErrorMessage(err),
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const progress = (step / 5) * 100

  return (
    <div className="container max-w-3xl mx-auto py-12 px-4 animate-fade-in-up">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-secondary mb-2">Solicitação de Portabilidade</h1>
        <p className="text-muted-foreground">Preencha os dados abaixo de forma segura.</p>
      </div>

      <Progress value={progress} className="h-2 mb-8 bg-slate-100" />

      <Card className="shadow-lg border-none ring-1 ring-black/5">
        <CardHeader className="bg-slate-50/50 border-b pb-6">
          <CardTitle className="text-xl">
            {step === 1 && 'Passo 1: Fatura Atual'}
            {step === 2 && 'Passo 2: Localidade e Operadora'}
            {step === 3 && 'Passo 3: Dados da Portabilidade'}
            {step === 4 && 'Passo 4: Documento de Identificação'}
            {step === 5 && 'Passo 5: Autorização em Vídeo'}
          </CardTitle>
          <CardDescription>Siga os passos corretamente.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          {step === 1 && <Step1 data={formData} update={updateData} />}
          {step === 2 && <Step2 data={formData} update={updateData} />}
          {step === 3 && <Step3 data={formData} update={updateData} />}
          {step === 4 && <Step4 data={formData} update={updateData} />}
          {step === 5 && <Step5 data={formData} update={updateData} />}

          <div className="flex justify-between mt-10 pt-6 border-t">
            <Button variant="outline" onClick={handleBack} disabled={step === 1 || loading}>
              Voltar
            </Button>
            {step < 5 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-primary hover:bg-primary/90 text-white min-w-[120px]"
              >
                Próximo Passo
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading || !canProceed()}
                className="bg-secondary hover:bg-secondary/90 text-white min-w-[120px]"
              >
                {loading ? 'Enviando...' : 'Concluir'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

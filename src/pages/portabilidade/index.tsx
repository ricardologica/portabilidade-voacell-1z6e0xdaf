import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAppStore from '@/stores/useAppStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import Step1 from './components/Step1'
import Step2 from './components/Step2'
import Step3 from './components/Step3'
import Step4 from './components/Step4'
import Step5 from './components/Step5'
import { PortabilityRequest } from '@/types'

export type FormData = Omit<PortabilityRequest, 'id' | 'createdAt' | 'status'>

const INITIAL_DATA: FormData = {
  ownerName: '',
  document: '',
  email: '',
  currentOperator: '',
  locality: '',
  numbers: [],
  documentsUploaded: false,
  videoAuthorized: false,
}

export default function PortabilidadePage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA)
  const [loading, setLoading] = useState(false)
  const { addRequest } = useAppStore()
  const navigate = useNavigate()
  const { toast } = useToast()

  const updateData = (fields: Partial<FormData>) => setFormData((prev) => ({ ...prev, ...fields }))

  const handleNext = () => setStep((s) => Math.min(s + 1, 5))
  const handleBack = () => setStep((s) => Math.max(s - 1, 1))

  const handleSubmit = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500))
    addRequest(formData)
    setLoading(false)
    toast({
      title: 'Solicitação Enviada!',
      description: 'Sua portabilidade foi registrada com sucesso.',
    })
    navigate('/')
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
            {step === 1 && 'Passo 1: Identificação'}
            {step === 2 && 'Passo 2: Detalhes da Linha'}
            {step === 3 && 'Passo 3: Documentação'}
            {step === 4 && 'Passo 4: Autorização por Vídeo'}
            {step === 5 && 'Passo 5: Termos e Consentimento'}
          </CardTitle>
          <CardDescription>
            {step === 4
              ? 'Etapa obrigatória para prevenção de fraudes.'
              : 'Todos os campos marcados com * são obrigatórios.'}
          </CardDescription>
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
                className="bg-primary hover:bg-primary/90 text-white min-w-[120px]"
              >
                Próximo Passo
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading || !formData.videoAuthorized || !formData.documentsUploaded}
                className="bg-secondary hover:bg-secondary/90 text-white min-w-[120px]"
              >
                {loading ? 'Enviando...' : 'Concluir Solicitação'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

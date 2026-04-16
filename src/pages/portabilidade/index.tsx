import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
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
  id?: string
  invoice_file: File | string | null
  state: string
  city: string
  origin_operator: string
  numbers: string
  titular_name: string
  titular_document: string
  representative_name?: string
  holder_name?: string
  tax_id?: string
  total_amount?: number
  phone_lines?: string
  document_file: File | string | null
  video_auth_file: File | string | null
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
  const [isSaving, setIsSaving] = useState(false)

  const { user } = useAppStore()
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()

  const editingId = (location.state as any)?.requestId

  const [debouncedData, setDebouncedData] = useState(formData)
  const isInitialMount = useRef(true)
  const isSubmitting = useRef(false)

  const updateData = (fields: Partial<PortabilityFormData>) =>
    setFormData((prev) => ({ ...prev, ...fields }))

  const handleNext = async () => {
    if (step === 4) {
      if (formData.document_file instanceof File) {
        setLoading(true)
        try {
          const uploadData = new FormData()
          uploadData.append('file', formData.document_file)
          const res = await pb.send('/backend/v1/parse-document', {
            method: 'POST',
            body: uploadData,
          })

          const docName = res.titular_name?.trim().toUpperCase() || ''
          const inputName = formData.titular_name?.trim().toUpperCase() || ''
          const docDoc = res.titular_document?.replace(/\D/g, '') || ''
          const inputDoc = formData.titular_document?.replace(/\D/g, '') || ''

          let hasWarning = false
          if (docName && inputName) {
            const inputParts = inputName.split(' ').filter((p: string) => p.length > 2)
            const hasMatch = inputParts.some((p: string) => docName.includes(p))
            if (!hasMatch) {
              toast({
                title: 'Aviso de Divergência de Nome',
                description:
                  'O nome no documento parece não coincidir com o nome do titular da fatura.',
                variant: 'destructive',
              })
              hasWarning = true
            }
          }

          if (!hasWarning && docDoc && inputDoc && docDoc !== inputDoc) {
            toast({
              title: 'Aviso de Divergência de Documento',
              description:
                'O número do documento (CPF/CNPJ) lido na imagem não confere com o digitado.',
              variant: 'destructive',
            })
          }
        } catch (err) {
          console.error('Erro na validação do documento:', err)
        } finally {
          setLoading(false)
        }
      }
    }
    setStep((s) => Math.min(s + 1, 5))
  }

  const handleBack = () => setStep((s) => Math.max(s - 1, 1))

  const canProceed = () => {
    if (step === 1) return !!formData.invoice_file
    if (step === 2) return !!formData.state && !!formData.city && !!formData.origin_operator
    if (step === 3)
      return !!formData.numbers.trim() && !!formData.titular_name && !!formData.titular_document
    if (step === 4) {
      const isCNPJ = formData.titular_document?.replace(/\D/g, '').length > 11
      if (isCNPJ && !formData.representative_name?.trim()) return false
      return !!formData.document_file
    }
    if (step === 5) return !!formData.video_auth_file && formData.invoice_up_to_date
    return true
  }

  useEffect(() => {
    if (!user) return
    const loadDraft = async () => {
      try {
        let draft
        if (editingId) {
          const req = await pb.collection('portability_requests').getOne(editingId)
          if (req.user_id === user.id) draft = req
        } else {
          const drafts = await pb.collection('portability_requests').getFullList({
            filter: `user_id = "${user.id}" && status = "draft"`,
            sort: '-created',
            limit: 1,
          })
          if (drafts.length > 0) draft = drafts[0]
        }

        if (draft) {
          setFormData({
            id: draft.id,
            invoice_file: draft.invoice_file || null,
            state: draft.state || '',
            city: draft.city || '',
            origin_operator: draft.origin_operator || '',
            numbers: draft.numbers || '',
            titular_name: draft.titular_name || '',
            titular_document: draft.titular_document || '',
            representative_name: draft.representative_name || '',
            holder_name: draft.holder_name || '',
            tax_id: draft.tax_id || '',
            total_amount: draft.total_amount || undefined,
            phone_lines: draft.phone_lines || '',
            document_file: draft.document_file || null,
            video_auth_file: draft.video_auth_file || null,
            invoice_up_to_date: false,
          })

          let resumeStep = 1
          if (draft.video_auth_file) resumeStep = 5
          else if (draft.document_file) resumeStep = 5
          else if (draft.numbers && draft.titular_name && draft.titular_document) resumeStep = 4
          else if (draft.state && draft.city && draft.origin_operator) resumeStep = 3
          else if (draft.invoice_file) resumeStep = 2

          setStep(resumeStep)
        }
      } catch (err) {
        console.error('Erro ao carregar rascunho:', err)
      }
    }
    loadDraft()
  }, [user])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedData(formData)
    }, 1500)
    return () => clearTimeout(timer)
  }, [formData])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    if (!user || loading || isSubmitting.current) return
    if (
      !debouncedData.id &&
      !debouncedData.invoice_file &&
      !debouncedData.state &&
      !debouncedData.numbers
    )
      return

    const saveDraft = async () => {
      setIsSaving(true)
      try {
        const pbData = new FormData()
        pbData.append('user_id', user.id)
        pbData.append('status', 'draft')

        const fields = [
          'state',
          'city',
          'origin_operator',
          'numbers',
          'titular_name',
          'titular_document',
          'holder_name',
          'tax_id',
          'phone_lines',
          'representative_name',
        ]
        fields.forEach((f) => {
          const val = debouncedData[f as keyof PortabilityFormData]
          if (val) pbData.append(f, val as string)
        })

        if (debouncedData.total_amount) {
          pbData.append('total_amount', debouncedData.total_amount.toString())
        }

        let fileUploaded = false
        if (debouncedData.invoice_file instanceof File) {
          pbData.append('invoice_file', debouncedData.invoice_file)
          fileUploaded = true
        }
        if (debouncedData.document_file instanceof File) {
          pbData.append('document_file', debouncedData.document_file)
          fileUploaded = true
        }
        if (debouncedData.video_auth_file instanceof File) {
          pbData.append('video_auth_file', debouncedData.video_auth_file)
          fileUploaded = true
        }

        let record
        if (debouncedData.id) {
          record = await pb.collection('portability_requests').update(debouncedData.id, pbData)
        } else {
          record = await pb.collection('portability_requests').create(pbData)
        }

        if (record) {
          setFormData((prev) => ({
            ...prev,
            id: record.id,
            invoice_file:
              fileUploaded && prev.invoice_file instanceof File
                ? record.invoice_file
                : prev.invoice_file,
            document_file:
              fileUploaded && prev.document_file instanceof File
                ? record.document_file
                : prev.document_file,
            video_auth_file:
              fileUploaded && prev.video_auth_file instanceof File
                ? record.video_auth_file
                : prev.video_auth_file,
          }))
        }
      } catch (err) {
        console.error('Erro ao salvar rascunho', err)
      } finally {
        setIsSaving(false)
      }
    }

    saveDraft()
  }, [debouncedData, user, loading])

  const handleSubmit = async () => {
    if (!user) return
    isSubmitting.current = true
    setLoading(true)
    try {
      const data = new FormData()
      data.append('status', 'pending')
      data.append('state', formData.state)
      data.append('city', formData.city)
      data.append('origin_operator', formData.origin_operator)
      data.append('numbers', formData.numbers)
      data.append('titular_name', formData.titular_name)
      data.append('titular_document', formData.titular_document)
      data.append('holder_name', formData.holder_name || formData.titular_name)
      data.append('tax_id', formData.tax_id || formData.titular_document)
      if (formData.representative_name)
        data.append('representative_name', formData.representative_name)
      if (formData.total_amount) data.append('total_amount', formData.total_amount.toString())
      data.append('phone_lines', formData.phone_lines || formData.numbers)

      if (formData.invoice_file instanceof File) data.append('invoice_file', formData.invoice_file)
      if (formData.document_file instanceof File)
        data.append('document_file', formData.document_file)
      if (formData.video_auth_file instanceof File)
        data.append('video_auth_file', formData.video_auth_file)

      if (formData.id) {
        await pb.collection('portability_requests').update(formData.id, data)
      } else {
        data.append('user_id', user.id)
        await pb.collection('portability_requests').create(data)
      }

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
      isSubmitting.current = false
    }
  }

  const progress = (step / 5) * 100

  return (
    <div className="container max-w-3xl mx-auto py-12 px-4 animate-fade-in-up">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-secondary">Solicitação de Portabilidade</h1>
        </div>
        <div className="flex justify-center items-center h-6">
          {isSaving ? (
            <span className="text-xs text-primary bg-primary/10 px-3 py-1 rounded-full animate-pulse">
              Salvando rascunho...
            </span>
          ) : (
            <p className="text-muted-foreground">Preencha os dados abaixo de forma segura.</p>
          )}
        </div>
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

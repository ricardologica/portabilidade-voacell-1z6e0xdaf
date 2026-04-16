import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { AlertTriangle, FileUp, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import pb from '@/lib/pocketbase/client'
import { PortabilityFormData } from '../index'

export default function Step4({
  data,
  update,
}: {
  data: PortabilityFormData
  update: (d: Partial<PortabilityFormData>) => void
}) {
  const [isParsing, setIsParsing] = useState(false)
  const [warning, setWarning] = useState<string | null>(null)

  const isCNPJ = data.titular_document?.replace(/\D/g, '').length > 11

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      update({ document_file: file })

      setIsParsing(true)
      setWarning(null)

      try {
        const formData = new FormData()
        formData.append('file', file)

        const res = await pb.send('/backend/v1/parse-document', {
          method: 'POST',
          body: formData,
        })

        const extractedName = res.titular_name?.trim().toUpperCase() || ''
        const invoiceName = (data.holder_name || data.titular_name)?.trim().toUpperCase() || ''

        let showWarning = false
        if (extractedName && invoiceName) {
          if (!extractedName.includes(invoiceName) && !invoiceName.includes(extractedName)) {
            showWarning = true
          }
        }

        update({
          titular_name: res.titular_name || data.titular_name,
          titular_document: res.titular_document || data.titular_document,
          representative_name: res.representative_name || data.representative_name || '',
        })

        if (showWarning) {
          setWarning(
            `Atenção: O nome no documento (${res.titular_name}) não corresponde exatamente ao nome da fatura (${data.holder_name || data.titular_name}). Certifique-se de que é a mesma pessoa.`,
          )
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsParsing(false)
      }
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <Label>Documento de Identificação do Titular (PDF) *</Label>
        <p className="text-sm text-muted-foreground mb-4">
          Anexe um documento válido com foto (RG/CNH) ou o Contrato Social da empresa.
        </p>

        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors">
          <FileUp className="h-8 w-8 text-slate-400 mb-2" />
          <p className="text-sm font-medium mb-1 text-center truncate max-w-full px-4">
            {data.document_file instanceof File
              ? data.document_file.name
              : typeof data.document_file === 'string'
                ? 'Documento Salvo (Rascunho)'
                : 'Clique para selecionar o arquivo PDF'}
          </p>
          <p className="text-xs text-muted-foreground mb-4">Apenas arquivos PDF são aceitos.</p>
          <label className="cursor-pointer bg-white border shadow-sm px-4 py-2 rounded-md text-sm hover:bg-slate-50">
            Escolher Arquivo
            <input
              type="file"
              className="hidden"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {isParsing && (
          <div className="flex items-center gap-2 text-sm text-primary mt-4 justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
            Analisando documento e validando identidade...
          </div>
        )}

        {warning && (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Inconsistência Detectada</AlertTitle>
            <AlertDescription>{warning}</AlertDescription>
          </Alert>
        )}

        {isCNPJ && (
          <div className="mt-6 p-4 border rounded-lg bg-slate-50 animate-fade-in-up">
            <Label className="text-base">Nome do Representante Legal *</Label>
            <p className="text-xs text-muted-foreground mb-3 mt-1">
              Como a titularidade é um CNPJ, identifique o representante legal autorizado a assinar.
            </p>
            <Input
              value={data.representative_name || ''}
              onChange={(e) => update({ representative_name: e.target.value })}
              placeholder="Nome completo do representante"
              className="h-12"
            />
          </div>
        )}
      </div>
    </div>
  )
}

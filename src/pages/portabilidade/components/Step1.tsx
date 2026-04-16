import { useState } from 'react'
import { FileUp, AlertTriangle, Loader2, CheckCircle2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import pb from '@/lib/pocketbase/client'
import { PortabilityFormData } from '../index'

export default function Step1({
  data,
  update,
}: {
  data: PortabilityFormData
  update: (d: Partial<PortabilityFormData>) => void
}) {
  const [isParsing, setIsParsing] = useState(false)
  const { toast } = useToast()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      update({ invoice_file: file })

      setIsParsing(true)
      try {
        const formData = new FormData()
        formData.append('file', file)

        const res = await pb.send('/backend/v1/parse-invoice', {
          method: 'POST',
          body: formData,
        })

        update({
          holder_name: res.holder_name,
          tax_id: res.tax_id,
          total_amount: res.total_amount,
          phone_lines: res.phone_lines,
          titular_name: res.holder_name || '',
          titular_document: res.tax_id || '',
          numbers: res.phone_lines || '',
          origin_operator: res.origin_operator || '',
        })

        toast({
          title: 'Fatura processada com sucesso!',
          description: 'Os dados foram extraídos e preenchidos.',
        })
      } catch (err) {
        toast({
          title: 'Erro ao ler fatura',
          description: 'Por favor, preencha os dados manualmente nos próximos passos.',
          variant: 'destructive',
        })
      } finally {
        setIsParsing(false)
      }
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-md text-sm flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold mb-1">Atenção: Fatura Atualizada</p>
          <p>
            A fatura da sua operadora atual deve estar em dia. O upload da fatura mais recente
            (paga) é obrigatório para evitar que a operadora de origem bloqueie o procedimento de
            portabilidade.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Fatura da Operadora de Origem (PDF) *</Label>
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors">
          <FileUp className="h-8 w-8 text-slate-400 mb-2" />
          <p className="text-sm font-medium mb-1 text-center truncate max-w-full px-4">
            {data.invoice_file instanceof File
              ? data.invoice_file.name
              : typeof data.invoice_file === 'string'
                ? 'Fatura Salva (Rascunho)'
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
            Analisando documento...
          </div>
        )}

        {!isParsing && data.holder_name && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4 space-y-3 animate-fade-in-up">
            <div className="flex items-center gap-2 text-green-800 font-medium">
              <CheckCircle2 className="h-5 w-5" />
              Dados Extraídos com Sucesso
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-xs text-muted-foreground">Titular</Label>
                <div className="font-medium text-slate-900">{data.holder_name}</div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">CPF/CNPJ</Label>
                <div className="font-medium text-slate-900">{data.tax_id}</div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Linhas</Label>
                <div className="font-medium text-slate-900">{data.phone_lines}</div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Valor da Fatura</Label>
                <div className="font-medium text-slate-900">
                  R$ {data.total_amount?.toFixed(2).replace('.', ',')}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

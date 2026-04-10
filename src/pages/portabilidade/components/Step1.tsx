import { FileUp, AlertTriangle } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { PortabilityFormData } from '../index'

export default function Step1({
  data,
  update,
}: {
  data: PortabilityFormData
  update: (d: Partial<PortabilityFormData>) => void
}) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      update({ invoice_file: e.target.files[0] })
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
            {data.invoice_file ? data.invoice_file.name : 'Clique para selecionar o arquivo PDF'}
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
      </div>
    </div>
  )
}

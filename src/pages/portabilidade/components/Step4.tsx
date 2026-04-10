import { Label } from '@/components/ui/label'
import { FileUp } from 'lucide-react'
import { PortabilityFormData } from '../index'

export default function Step4({
  data,
  update,
}: {
  data: PortabilityFormData
  update: (d: Partial<PortabilityFormData>) => void
}) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      update({ document_file: e.target.files[0] })
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
            {data.document_file ? data.document_file.name : 'Clique para selecionar o arquivo PDF'}
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

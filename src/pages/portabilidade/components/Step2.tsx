import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FileUp } from 'lucide-react'
import { PortabilityFormData } from '../index'

export default function Step2({
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
        <Label htmlFor="titular_name">Nome do Titular (Conforme Fatura) *</Label>
        <Input
          id="titular_name"
          placeholder="Ex: Empresa Tech Mundo Telecom"
          value={data.titular_name}
          onChange={(e) => update({ titular_name: e.target.value })}
          className="h-12 text-base"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="titular_document">CNPJ / CPF do Titular *</Label>
        <Input
          id="titular_document"
          placeholder="Apenas números"
          value={data.titular_document}
          onChange={(e) => update({ titular_document: e.target.value })}
          className="h-12 text-base"
        />
      </div>

      <div className="space-y-2 pt-4 border-t">
        <Label>Documento de Identificação (RG/CNH ou Contrato Social) *</Label>
        <div className="border border-dashed border-slate-300 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 hover:bg-slate-100 transition-colors">
          <div className="text-sm font-medium truncate max-w-full">
            {data.document_file ? data.document_file.name : 'Nenhum documento selecionado'}
          </div>
          <label className="cursor-pointer bg-white border shadow-sm px-4 py-2 rounded-md text-sm hover:bg-slate-50 flex items-center shrink-0">
            <FileUp className="h-4 w-4 mr-2" />
            Anexar PDF
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

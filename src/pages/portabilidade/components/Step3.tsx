import { useState } from 'react'
import { UploadCloud, CheckCircle2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { FormData } from '../index'

export default function Step3({
  data,
  update,
}: {
  data: FormData
  update: (d: Partial<FormData>) => void
}) {
  const [uploaded, setUploaded] = useState(data.documentsUploaded)

  const handleSimulateUpload = () => {
    setUploaded(true)
    update({ documentsUploaded: true })
  }

  const FileUploader = ({
    label,
    required = true,
    hasTemplate = false,
  }: {
    label: string
    required?: boolean
    hasTemplate?: boolean
  }) => (
    <div className="border border-dashed border-slate-300 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors gap-4">
      <div className="flex flex-col">
        <Label className="text-sm font-semibold">
          {label} {required && '*'}
        </Label>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">Formato aceito: PDF</span>
          {hasTemplate && (
            <>
              <span className="text-xs text-muted-foreground">•</span>
              <button
                type="button"
                className="text-xs text-primary hover:underline"
                onClick={() => alert('Download do template iniciado')}
              >
                Baixar Template
              </button>
            </>
          )}
        </div>
      </div>
      {uploaded ? (
        <div className="flex items-center text-primary text-sm font-medium self-start sm:self-auto">
          <CheckCircle2 className="h-5 w-5 mr-1" /> Anexado
        </div>
      ) : (
        <label className="cursor-pointer bg-white border shadow-sm px-4 py-2 rounded-md text-sm hover:bg-slate-50 flex items-center self-start sm:self-auto whitespace-nowrap">
          <UploadCloud className="h-4 w-4 mr-2 text-slate-500" />
          Escolher arquivo
          <input
            type="file"
            className="hidden"
            accept=".pdf,application/pdf"
            onChange={handleSimulateUpload}
          />
        </label>
      )}
    </div>
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <p className="text-sm text-muted-foreground mb-4">
        Faça o upload dos documentos necessários. Apenas arquivos PDF são estritamente aceitos.
      </p>

      <div className="space-y-4">
        <FileUploader label="Termo de Portabilidade Assinado" hasTemplate={true} />
        <FileUploader label="Última Fatura (Conta detalhada)" />
        <FileUploader label="Documento RG ou CNH do Titular/Sócio" />
        <FileUploader label="Documento Extra" required={false} />
      </div>
    </div>
  )
}

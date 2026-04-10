import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { FormData } from '../index'

export default function Step5({
  data,
  update,
}: {
  data: FormData
  update: (d: Partial<FormData>) => void
}) {
  // We don't store this in global state as it's just local consent confirmation
  return (
    <div className="space-y-6 animate-fade-in pt-4">
      <div className="flex items-start space-x-3 bg-slate-50 p-4 rounded-lg border">
        <Checkbox id="terms1" className="mt-1 border-primary data-[state=checked]:bg-primary" />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="terms1" className="text-base font-medium">
            Confirmo a veracidade das informações
          </Label>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Atesto possuir a autonomia necessária para a realização da portabilidade descrita e que
            todos os dados e documentos fornecidos são verdadeiros.
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-3 bg-slate-50 p-4 rounded-lg border">
        <Checkbox id="terms2" className="mt-1 border-primary data-[state=checked]:bg-primary" />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="terms2" className="text-base font-medium">
            Consentimento de Tratamento de Dados (LGPD)
          </Label>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Autorizo o tratamento dos meus dados pessoais (incluindo biometria facial) pela Voacell
            exclusivamente para fins de prevenção à fraude e efetivação do processo de
            portabilidade, em conformidade com a Lei Geral de Proteção de Dados (Lei nº
            13.709/2018).
          </p>
        </div>
      </div>
    </div>
  )
}

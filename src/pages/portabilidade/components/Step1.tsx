import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormData } from '../index'

export default function Step1({
  data,
  update,
}: {
  data: FormData
  update: (d: Partial<FormData>) => void
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="ownerName">Proprietário da Linha *</Label>
        <Input
          id="ownerName"
          placeholder="Ex: Empresa Tech Mundo Telecom"
          value={data.ownerName}
          onChange={(e) => update({ ownerName: e.target.value })}
          className="h-12 text-base"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="document">CNPJ / CPF (apenas números) *</Label>
        <Input
          id="document"
          placeholder="Ex: 27298128000130"
          value={data.document}
          onChange={(e) => update({ document: e.target.value })}
          className="h-12 text-base"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail de Acompanhamento *</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={data.email}
          onChange={(e) => update({ email: e.target.value })}
          className="h-12 text-base"
        />
        <p className="text-xs text-red-500 font-medium pt-1">
          * Este e-mail será utilizado para acompanhar a solicitação de portabilidade.
        </p>
      </div>
    </div>
  )
}

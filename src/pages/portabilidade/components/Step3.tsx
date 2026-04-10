import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { PortabilityFormData } from '../index'

export default function Step3({
  data,
  update,
}: {
  data: PortabilityFormData
  update: (d: Partial<PortabilityFormData>) => void
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="numbers">Números a serem portados *</Label>
        <Textarea
          id="numbers"
          placeholder="Ex: 1921399887&#10;19999999999"
          className="min-h-[120px] font-mono text-base resize-none"
          value={data.numbers}
          onChange={(e) => update({ numbers: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          Insira um número por linha com DDD (ex: 1921399887). Inclua apenas números da mesma
          localidade (mesmo DDD e Cidade).
        </p>
      </div>

      <div className="space-y-2 pt-2">
        <Label htmlFor="titular_name">Nome do Titular (Conforme Fatura) *</Label>
        <Input
          id="titular_name"
          placeholder="Ex: Empresa Tech Mundo Telecom ou Nome Pessoal"
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
    </div>
  )
}

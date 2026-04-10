import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { PortabilityFormData } from '../index'

export default function Step4({
  data,
  update,
}: {
  data: PortabilityFormData
  update: (d: Partial<PortabilityFormData>) => void
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-md text-sm">
        <p className="font-semibold mb-1">Atenção:</p>
        <p>
          Inclua apenas números da mesma localidade (mesmo DDD e Cidade) em um pedido de
          portabilidade. Se desejar solicitar portabilidade de números de localidades diferentes,
          faça mais de um pedido.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="numbers">Números Portados *</Label>
        <Textarea
          id="numbers"
          placeholder="Ex: 1921399887&#10;19999999999"
          className="min-h-[160px] font-mono text-base resize-none"
          value={data.numbers}
          onChange={(e) => update({ numbers: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          Insira um número por linha, contendo o DDD (Código Nacional) e o número local (ex:
          1921399887). Não utilize formatação especial.
        </p>
      </div>
    </div>
  )
}

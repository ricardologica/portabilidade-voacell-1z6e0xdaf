import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FormData } from '../index'

export default function Step2({
  data,
  update,
}: {
  data: FormData
  update: (d: Partial<FormData>) => void
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Operadora Atual *</Label>
          <Select
            value={data.currentOperator}
            onValueChange={(v) => update({ currentOperator: v })}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Selecione a operadora" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Vivo">Vivo</SelectItem>
              <SelectItem value="Claro">Claro</SelectItem>
              <SelectItem value="TIM">TIM</SelectItem>
              <SelectItem value="Oi">Oi</SelectItem>
              <SelectItem value="Outra">Outra</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Localidade *</Label>
          <Select value={data.locality} onValueChange={(v) => update({ locality: v })}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Selecione uma Localidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SP (DDD 11)">São Paulo (DDD 11)</SelectItem>
              <SelectItem value="RJ (DDD 21)">Rio de Janeiro (DDD 21)</SelectItem>
              <SelectItem value="MG (DDD 31)">Minas Gerais (DDD 31)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="numbers">Números Portados *</Label>
        <Textarea
          id="numbers"
          placeholder="Ex: 11999991111 (Um número por linha)"
          className="min-h-[120px] font-mono text-base resize-none"
          value={data.numbers.join('\n')}
          onChange={(e) => update({ numbers: e.target.value.split('\n').filter(Boolean) })}
        />
        <p className="text-xs text-muted-foreground">
          Importante: A portabilidade só pode ser realizada entre números de mesma titularidade e
          localidade.
        </p>
      </div>
    </div>
  )
}

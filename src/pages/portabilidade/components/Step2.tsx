import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FormData } from '../index'

const STATES = ['SP', 'RJ', 'MG', 'PR', 'SC', 'RS', 'BA', 'PE', 'CE', 'DF']
const CITIES: Record<string, string[]> = {
  SP: ['São Paulo', 'Campinas', 'Santos', 'Ribeirão Preto'],
  RJ: ['Rio de Janeiro', 'Niterói', 'Macaé', 'Petrópolis'],
  MG: ['Belo Horizonte', 'Uberlândia', 'Juiz de Fora', 'Ouro Preto'],
  PR: ['Curitiba', 'Londrina', 'Maringá'],
  SC: ['Florianópolis', 'Joinville', 'Blumenau'],
  RS: ['Porto Alegre', 'Caxias do Sul', 'Pelotas'],
  BA: ['Salvador', 'Feira de Santana', 'Vitória da Conquista'],
  PE: ['Recife', 'Jaboatão dos Guararapes', 'Olinda'],
  CE: ['Fortaleza', 'Caucaia', 'Juazeiro do Norte'],
  DF: ['Brasília'],
}

export default function Step2({
  data,
  update,
}: {
  data: FormData
  update: (d: Partial<FormData>) => void
}) {
  const citiesForState = data.state ? CITIES[data.state] || [] : []

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Operadora Atual (Origem) *</Label>
          <Select
            value={data.currentOperator}
            onValueChange={(v) => {
              update({ currentOperator: v })
              if (v !== 'Outra') update({ operatorOther: '' })
            }}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Selecione a operadora" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Vivo">Vivo</SelectItem>
              <SelectItem value="Claro">Claro</SelectItem>
              <SelectItem value="TIM">TIM</SelectItem>
              <SelectItem value="Oi">Oi</SelectItem>
              <SelectItem value="Algar">Algar Telecom</SelectItem>
              <SelectItem value="Outra">Outra</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {data.currentOperator === 'Outra' && (
          <div className="space-y-2">
            <Label>Qual operadora? *</Label>
            <Input
              className="h-12"
              placeholder="Digite o nome da operadora"
              value={data.operatorOther || ''}
              onChange={(e) => update({ operatorOther: e.target.value })}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label>Estado (UF) *</Label>
          <Select value={data.state} onValueChange={(v) => update({ state: v, city: '' })}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Selecione o Estado" />
            </SelectTrigger>
            <SelectContent>
              {STATES.map((uf) => (
                <SelectItem key={uf} value={uf}>
                  {uf}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Cidade *</Label>
          <Select
            value={data.city}
            onValueChange={(v) => update({ city: v })}
            disabled={!data.state}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Selecione a Cidade" />
            </SelectTrigger>
            <SelectContent>
              {citiesForState.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-md text-sm">
        <p className="font-semibold">Atenção:</p>
        <p>
          Inclua apenas números da mesma localidade em um pedido de portabilidade. Se desejar
          solicitar portabilidade de números de localidades diferentes, faça mais de um pedido.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="numbers">Números Portados *</Label>
        <Textarea
          id="numbers"
          placeholder="Ex: 1921399887&#10;19999999999"
          className="min-h-[120px] font-mono text-base resize-none"
          value={data.numbers.join('\n')}
          onChange={(e) => update({ numbers: e.target.value.split('\n') })}
        />
        <p className="text-xs text-muted-foreground">
          Insira um número por linha, contendo o DDD (Código Nacional) e o número local (ex:
          1921399887).
        </p>
      </div>
    </div>
  )
}

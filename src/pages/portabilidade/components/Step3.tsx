import { useState } from 'react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PortabilityFormData } from '../index'

const STATES = ['SP', 'RJ', 'MG', 'PR', 'SC', 'RS', 'BA', 'PE', 'CE', 'DF']
const CITIES_MOCK: Record<string, string[]> = {
  SP: [
    'São Paulo',
    'Campinas',
    'Santos',
    'Ribeirão Preto',
    'São José dos Campos',
    'Sorocaba',
    'Guarulhos',
  ],
  RJ: ['Rio de Janeiro', 'Niterói', 'Macaé', 'Petrópolis', 'Cabo Frio', 'Volta Redonda'],
  MG: ['Belo Horizonte', 'Uberlândia', 'Juiz de Fora', 'Ouro Preto', 'Contagem', 'Betim'],
  PR: ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel'],
  SC: ['Florianópolis', 'Joinville', 'Blumenau', 'São José', 'Chapecó'],
  RS: ['Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Canoas', 'Santa Maria'],
  BA: ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari'],
  PE: ['Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Caruaru'],
  CE: ['Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú'],
  DF: ['Brasília', 'Taguatinga', 'Ceilândia'],
}

export default function Step3({
  data,
  update,
}: {
  data: PortabilityFormData
  update: (d: Partial<PortabilityFormData>) => void
}) {
  const [openCity, setOpenCity] = useState(false)
  const cities = data.state ? CITIES_MOCK[data.state] || [] : []

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Operadora de Origem *</Label>
          <Select
            value={data.origin_operator}
            onValueChange={(v) => update({ origin_operator: v })}
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
      </div>

      <div className="space-y-2">
        <Label>Cidade *</Label>
        <Popover open={openCity} onOpenChange={setOpenCity}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openCity}
              disabled={!data.state}
              className="w-full h-12 justify-between font-normal"
            >
              {data.city
                ? data.city
                : data.state
                  ? 'Selecione uma cidade...'
                  : 'Selecione o Estado primeiro'}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
            <Command>
              <CommandInput placeholder="Buscar cidade..." />
              <CommandList>
                <CommandEmpty>Nenhuma cidade encontrada.</CommandEmpty>
                <CommandGroup>
                  {cities.map((city) => (
                    <CommandItem
                      key={city}
                      value={city}
                      onSelect={(currentValue) => {
                        update({ city: currentValue === data.city ? '' : city })
                        setOpenCity(false)
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          data.city === city ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      {city}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

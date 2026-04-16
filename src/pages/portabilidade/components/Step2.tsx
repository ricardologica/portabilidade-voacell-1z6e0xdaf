import { useState, useEffect } from 'react'
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

export default function Step2({
  data,
  update,
}: {
  data: PortabilityFormData
  update: (d: Partial<PortabilityFormData>) => void
}) {
  const [openCity, setOpenCity] = useState(false)
  const [states, setStates] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [loadingCities, setLoadingCities] = useState(false)

  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then((res) => res.json())
      .then((res) => setStates(res.map((s: any) => s.sigla)))
      .catch((err) => console.error(err))
  }, [])

  useEffect(() => {
    if (data.state) {
      setLoadingCities(true)
      fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${data.state}/municipios?orderBy=nome`,
      )
        .then((res) => res.json())
        .then((res) => {
          setCities(res.map((c: any) => c.nome))
        })
        .catch((err) => console.error(err))
        .finally(() => setLoadingCities(false))
    } else {
      setCities([])
    }
  }, [data.state])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Estado (UF) *</Label>
          <Select value={data.state} onValueChange={(v) => update({ state: v, city: '' })}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Selecione o Estado" />
            </SelectTrigger>
            <SelectContent>
              {states.length > 0 ? (
                states.map((uf) => (
                  <SelectItem key={uf} value={uf}>
                    {uf}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="SP">SP</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

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
                  ? loadingCities
                    ? 'Carregando cidades...'
                    : 'Selecione uma cidade...'
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

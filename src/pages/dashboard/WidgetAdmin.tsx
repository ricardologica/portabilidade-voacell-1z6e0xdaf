import { useEffect, useState } from 'react'
import pb from '@/lib/pocketbase/client'
import { useRealtime } from '@/hooks/use-realtime'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { WidgetSetting } from '@/types'

const defaultWidget: Partial<WidgetSetting> = {
  name: '',
  agent_id: '',
  schema: '',
  type: 'thunderemotionlite',
  is_active: true,
  placement: 'all',
}

export default function WidgetAdmin() {
  const [widgets, setWidgets] = useState<WidgetSetting[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<WidgetSetting>>(defaultWidget)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  const loadWidgets = async () => {
    try {
      const records = await pb.collection('widget_settings').getFullList<WidgetSetting>()
      setWidgets(records)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadWidgets()
  }, [])
  useRealtime('widget_settings', loadWidgets)

  const handleOpen = (widget?: WidgetSetting) => {
    if (widget) {
      setEditingId(widget.id)
      setFormData({ ...widget })
    } else {
      setEditingId(null)
      setFormData(defaultWidget)
    }
    setErrors({})
    setIsOpen(true)
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name?.trim()) newErrors.name = 'Nome é obrigatório'
    if (!formData.agent_id?.trim()) newErrors.agent_id = 'Agent ID é obrigatório'
    if (!formData.schema?.trim()) newErrors.schema = 'Schema é obrigatório'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return

    try {
      if (editingId) {
        await pb.collection('widget_settings').update(editingId, formData)
        toast({ title: 'Widget atualizado com sucesso' })
      } else {
        await pb.collection('widget_settings').create(formData)
        toast({ title: 'Widget criado com sucesso' })
      }
      setIsOpen(false)
    } catch (err) {
      toast({ title: 'Erro ao salvar widget', variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este widget?')) return
    try {
      await pb.collection('widget_settings').delete(id)
      toast({ title: 'Widget excluído com sucesso' })
    } catch (err) {
      toast({ title: 'Erro ao excluir', variant: 'destructive' })
    }
  }

  const toggleActive = async (id: string, current: boolean) => {
    try {
      await pb.collection('widget_settings').update(id, { is_active: !current })
    } catch (err) {
      toast({ title: 'Erro ao alterar status', variant: 'destructive' })
    }
  }

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Atendimento Inteligente</CardTitle>
          <CardDescription>Gerencie as configurações dos widgets de atendimento.</CardDescription>
        </div>
        <Button onClick={() => handleOpen()} disabled={widgets.length >= 5}>
          <Plus className="w-4 h-4 mr-2" /> Novo Widget
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Agent ID</TableHead>
              <TableHead>Schema</TableHead>
              <TableHead>Local</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {widgets.map((w) => (
              <TableRow key={w.id}>
                <TableCell className="font-medium">{w.name}</TableCell>
                <TableCell className="font-mono text-xs">{w.agent_id}</TableCell>
                <TableCell className="font-mono text-xs">{w.schema}</TableCell>
                <TableCell className="capitalize">
                  {w.placement === 'all' ? 'Todos' : w.placement}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={w.is_active}
                    onCheckedChange={() => toggleActive(w.id, w.is_active)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleOpen(w)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(w.id)}
                    className="text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {widgets.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                  Nenhum widget configurado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Widget' : 'Novo Widget'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome do Widget</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Suporte Geral"
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label>Agent ID</Label>
              <Input
                value={formData.agent_id}
                onChange={(e) => setFormData({ ...formData, agent_id: e.target.value })}
                placeholder="Ex: 4b83eae2-..."
                className="font-mono text-sm"
              />
              {errors.agent_id && <p className="text-xs text-red-500">{errors.agent_id}</p>}
            </div>
            <div className="space-y-2">
              <Label>Schema</Label>
              <Input
                value={formData.schema}
                onChange={(e) => setFormData({ ...formData, schema: e.target.value })}
                placeholder="Ex: dd25ab83-..."
                className="font-mono text-sm"
              />
              {errors.schema && <p className="text-xs text-red-500">{errors.schema}</p>}
            </div>
            <div className="space-y-2">
              <Label>Tipo (Type)</Label>
              <Input
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                placeholder="thunderemotionlite"
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label>Exibição (Placement)</Label>
              <select
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.placement || 'all'}
                onChange={(e) => setFormData({ ...formData, placement: e.target.value as any })}
              >
                <option value="all">Todos</option>
                <option value="client">Área do Cliente</option>
                <option value="admin">Área Admin</option>
              </select>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="active">Ativo</Label>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

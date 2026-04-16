import { useEffect, useState } from 'react'
import pb from '@/lib/pocketbase/client'
import { useRealtime } from '@/hooks/use-realtime'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Eye, FileText } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import WidgetAdmin from './WidgetAdmin'

export default function AdminDashboard() {
  const [requests, setRequests] = useState<any[]>([])
  const [selectedReq, setSelectedReq] = useState<any | null>(null)
  const { toast } = useToast()

  const [editEot, setEditEot] = useState('')
  const [editTicket, setEditTicket] = useState('')
  const [editScheduling, setEditScheduling] = useState('')
  const [editStatus, setEditStatus] = useState('')

  const loadData = async () => {
    try {
      const reqs = await pb
        .collection('portability_requests')
        .getFullList({ sort: '-created', expand: 'user_id' })
      setRequests(reqs)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('portability_requests', loadData)

  useEffect(() => {
    if (selectedReq) {
      setEditEot(selectedReq.eot || '')
      setEditTicket(selectedReq.ticket_number || '')
      setEditScheduling(selectedReq.scheduling ? selectedReq.scheduling.split('T')[0] : '')
      setEditStatus(selectedReq.status || 'pending')
    }
  }, [selectedReq])

  const handleSave = async () => {
    if (selectedReq) {
      try {
        const dataToUpdate: any = {
          status: editStatus,
          eot: editEot,
          ticket_number: editTicket,
        }
        if (editScheduling) {
          dataToUpdate.scheduling = new Date(editScheduling).toISOString()
        } else {
          dataToUpdate.scheduling = null
        }

        const updated = await pb
          .collection('portability_requests')
          .update(selectedReq.id, dataToUpdate)

        toast({
          title: 'Dados Atualizados',
          description: `A solicitação foi atualizada com sucesso.`,
        })
        setSelectedReq(updated)
      } catch (err) {
        toast({
          title: 'Erro',
          description: 'Não foi possível atualizar os dados. Verifique suas permissões.',
          variant: 'destructive',
        })
      }
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-600">Aprovada</Badge>
      case 'pending':
        return <Badge className="bg-slate-500 hover:bg-slate-600 text-white">Pendente</Badge>
      case 'analyzing':
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-white">Analisando</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejeitada</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Tabs defaultValue="requests" className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Painel Administrativo</h2>
        <TabsList>
          <TabsTrigger value="requests">Solicitações</TabsTrigger>
          <TabsTrigger value="widgets">Atendimento Inteligente</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="requests" className="space-y-6 m-0">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Solicitações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{requests.length}</div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Aguardando Análise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">
                {requests.filter((r) => r.status === 'pending' || r.status === 'analyzing').length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Aprovadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {requests.filter((r) => r.status === 'approved').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Fila de Portabilidade</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Cód</TableHead>
                  <TableHead>EOT</TableHead>
                  <TableHead>Data de Solicitação</TableHead>
                  <TableHead>Qtd. DIDs</TableHead>
                  <TableHead>TN</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Agendamento</TableHead>
                  <TableHead>Ticket</TableHead>
                  <TableHead className="text-right">Opções</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req) => {
                  const numList = req.numbers ? req.numbers.split('\n').filter(Boolean) : []
                  return (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium text-secondary">
                        {req.id.slice(0, 8)}
                      </TableCell>
                      <TableCell>{req.eot || '-'}</TableCell>
                      <TableCell>{new Date(req.created).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{numList.length}</TableCell>
                      <TableCell className="max-w-[120px] truncate" title={req.numbers}>
                        {req.numbers || '-'}
                      </TableCell>
                      <TableCell>{getStatusBadge(req.status)}</TableCell>
                      <TableCell>
                        {req.scheduling
                          ? new Date(req.scheduling).toLocaleDateString('pt-BR')
                          : '-'}
                      </TableCell>
                      <TableCell>{req.ticket_number || '-'}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedReq(req)}>
                          <Eye className="h-4 w-4 mr-2" /> Analisar
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {requests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-4">
                      Nenhuma solicitação encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Sheet open={!!selectedReq} onOpenChange={(open) => !open && setSelectedReq(null)}>
          <SheetContent className="sm:max-w-xl overflow-y-auto" side="right">
            {selectedReq && (
              <>
                <SheetHeader className="mb-6">
                  <SheetTitle className="text-xl text-secondary">
                    Análise: {selectedReq.id}
                  </SheetTitle>
                  <SheetDescription>
                    Verifique os dados e documentos antes de aprovar.
                  </SheetDescription>
                </SheetHeader>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold border-b pb-2">Dados do Cliente</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground block">Proprietário</span>
                        {selectedReq.titular_name}
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Documento</span>
                        {selectedReq.titular_document}
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Operadora Atual</span>
                        {selectedReq.origin_operator}
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Localidade</span>
                        {selectedReq.city} - {selectedReq.state}
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground block mb-1">Números a Portar</span>
                        <div className="bg-slate-50 p-2 rounded border font-mono text-xs max-h-24 overflow-y-auto whitespace-pre-wrap">
                          {selectedReq.numbers}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold border-b pb-2">Documentação Anexada</h3>
                    <div className="flex gap-2 flex-wrap">
                      {selectedReq.invoice_file && (
                        <a
                          href={pb.files.getUrl(selectedReq, selectedReq.invoice_file)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button variant="outline" size="sm" className="bg-slate-50">
                            <FileText className="h-4 w-4 mr-2 text-blue-500" /> Fatura Origem
                          </Button>
                        </a>
                      )}
                      {selectedReq.document_file && (
                        <a
                          href={pb.files.getUrl(selectedReq, selectedReq.document_file)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button variant="outline" size="sm" className="bg-slate-50">
                            <FileText className="h-4 w-4 mr-2 text-blue-500" /> Doc Titular
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold border-b pb-2">Validação por Vídeo</h3>
                    {selectedReq.video_auth_file ? (
                      <div className="aspect-video bg-black rounded-lg overflow-hidden border">
                        <video
                          controls
                          src={pb.files.getUrl(selectedReq, selectedReq.video_auth_file)}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="p-4 bg-slate-50 text-center text-sm text-muted-foreground border rounded-lg">
                        Nenhum vídeo anexado.
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t space-y-4">
                    <h3 className="font-semibold pb-2">Gerenciamento da Solicitação</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>EOT (Código da Operadora)</Label>
                        <Input
                          value={editEot}
                          onChange={(e) => setEditEot(e.target.value)}
                          placeholder="Ex: 000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Número do Ticket</Label>
                        <Input
                          value={editTicket}
                          onChange={(e) => setEditTicket(e.target.value)}
                          placeholder="Ex: INC-123"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Data de Agendamento</Label>
                        <Input
                          type="date"
                          value={editScheduling}
                          onChange={(e) => setEditScheduling(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={editStatus} onValueChange={setEditStatus}>
                          <SelectTrigger>
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pendente</SelectItem>
                            <SelectItem value="analyzing">Analisando</SelectItem>
                            <SelectItem value="approved">Aprovada</SelectItem>
                            <SelectItem value="rejected">Rejeitada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <Button onClick={handleSave} className="w-full">
                        Salvar Alterações
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </TabsContent>

      <TabsContent value="widgets" className="space-y-6 m-0">
        <WidgetAdmin />
      </TabsContent>
    </Tabs>
  )
}

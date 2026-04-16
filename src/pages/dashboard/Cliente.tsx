import { useEffect, useState } from 'react'
import useAppStore from '@/stores/useAppStore'
import pb from '@/lib/pocketbase/client'
import { useNavigate } from 'react-router-dom'
import { useRealtime } from '@/hooks/use-realtime'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Phone, Receipt, Clock, Download, Clock3, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ClienteDashboard() {
  const { user } = useAppStore()
  const navigate = useNavigate()
  const [requests, setRequests] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
  const [calls] = useState<any[]>([
    { id: '1', date: '2026-04-09 14:30', destination: '11 97777-3333', duration: '05:23' },
    { id: '2', date: '2026-04-08 09:15', destination: '21 96666-4444', duration: '12:05' },
  ])

  const loadData = async () => {
    if (!user) return
    try {
      const reqs = await pb
        .collection('portability_requests')
        .getFullList({ filter: `user_id = "${user.id}"`, sort: '-created' })
      setRequests(reqs)
      const invs = await pb
        .collection('billing')
        .getFullList({ filter: `user_id = "${user.id}"`, sort: '-due_date' })
      setInvoices(invs)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadData()
  }, [user])
  useRealtime('portability_requests', loadData)
  useRealtime('billing', loadData)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return (
          <Badge variant="outline" className="border-amber-400 text-amber-600">
            Rascunho
          </Badge>
        )
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-600">Aprovado</Badge>
      case 'pending':
        return <Badge className="bg-slate-500 hover:bg-slate-600 text-white">Pendente</Badge>
      case 'analyzing':
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-white">Em Análise</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejeitado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const activeLines = requests.filter((r) => r.status === 'approved').length
  const pendingReqs = requests.filter(
    (r) => r.status !== 'approved' && r.status !== 'rejected' && r.status !== 'draft',
  ).length
  const lastInvoice = invoices[0]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-secondary">Meu Painel</h2>
          <p className="text-muted-foreground text-sm">Acompanhe suas solicitações e faturas.</p>
        </div>
        <Button
          onClick={() => navigate('/portabilidade')}
          className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Nova Portabilidade
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-none shadow-sm shadow-black/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Linhas Ativas
            </CardTitle>
            <Phone className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{activeLines}</div>
            <p className="text-xs text-muted-foreground mt-1">Em sua conta</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm shadow-black/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Última Fatura
            </CardTitle>
            <Receipt className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              R$ {lastInvoice ? lastInvoice.amount.toFixed(2).replace('.', ',') : '0,00'}
            </div>
            {lastInvoice && lastInvoice.status === 'pending' && (
              <p className="text-xs text-muted-foreground mt-1 text-red-500 flex items-center gap-1">
                <Clock className="h-3 w-3" /> Vence em breve
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm shadow-black/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Solicitações
            </CardTitle>
            <Clock3 className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{pendingReqs}</div>
            <p className="text-xs text-muted-foreground mt-1">Em andamento</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="portability" className="w-full">
        <TabsList className="bg-white border rounded-md h-12 p-1">
          <TabsTrigger
            value="portability"
            className="rounded data-[state=active]:bg-slate-100 h-9 px-6"
          >
            Portabilidade
          </TabsTrigger>
          <TabsTrigger
            value="invoices"
            className="rounded data-[state=active]:bg-slate-100 h-9 px-6"
          >
            Faturas e Boletos
          </TabsTrigger>
          <TabsTrigger value="calls" className="rounded data-[state=active]:bg-slate-100 h-9 px-6">
            Chamadas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="portability" className="mt-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Acompanhamento de Portabilidade</CardTitle>
            </CardHeader>
            <CardContent>
              {requests.length === 0 ? (
                <p className="text-muted-foreground text-sm">Nenhuma solicitação encontrada.</p>
              ) : (
                <div className="space-y-4">
                  {requests.map((req) => {
                    const numbersList = req.numbers.split('\n').filter(Boolean)
                    return (
                      <div
                        key={req.id}
                        className="flex flex-col sm:flex-row justify-between gap-4 p-4 rounded-lg border bg-slate-50/50"
                      >
                        <div>
                          <h4 className="font-semibold">
                            {req.id} - {numbersList.length} número(s)
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            De: {req.origin_operator} | Para: Voacell
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Localidade: {req.city} - {req.state}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Criado em: {new Date(req.created).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className="flex flex-col items-start sm:items-end gap-2 justify-center">
                          {getStatusBadge(req.status)}
                          {(req.status === 'draft' ||
                            (req.status === 'pending' &&
                              (!req.video_auth_file ||
                                !req.document_file ||
                                !req.invoice_file))) && (
                            <Button
                              variant="link"
                              size="sm"
                              onClick={() =>
                                navigate('/portabilidade', { state: { requestId: req.id } })
                              }
                              className="h-auto p-0 text-primary"
                            >
                              Continuar Solicitação &rarr;
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="mt-6">
          <Card className="border-none shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-medium">
                        {new Date(inv.due_date).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>{inv.description}</TableCell>
                      <TableCell>R$ {inv.amount.toFixed(2).replace('.', ',')}</TableCell>
                      <TableCell>
                        {inv.status === 'paid' ? (
                          <Badge className="bg-green-500">Pago</Badge>
                        ) : (
                          <Badge variant="secondary">Pendente</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {inv.file ? (
                          <a href={pb.files.getUrl(inv, inv.file)} target="_blank" rel="noreferrer">
                            <Button variant="ghost" size="sm" className="text-primary">
                              <Download className="h-4 w-4 mr-2" /> PDF
                            </Button>
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground">Sem arquivo</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {invoices.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        Nenhuma fatura encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calls" className="mt-6">
          <Card className="border-none shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Destino</TableHead>
                    <TableHead>Duração</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calls.map((call) => (
                    <TableRow key={call.id}>
                      <TableCell>{call.date}</TableCell>
                      <TableCell className="font-mono">{call.destination}</TableCell>
                      <TableCell>{call.duration}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

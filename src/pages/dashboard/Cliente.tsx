import useAppStore from '@/stores/useAppStore'
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
import { Phone, Receipt, Clock, Download, CheckCircle2, Clock3 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ClienteDashboard() {
  const { requests, invoices, calls } = useAppStore()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Concluído</Badge>
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Em Análise
          </Badge>
        )
      case 'rejected':
        return <Badge variant="destructive">Rejeitado</Badge>
      default:
        return <Badge variant="outline">Processando</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-none shadow-sm shadow-black/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Linhas Ativas
            </CardTitle>
            <Phone className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">0</div>
            <p className="text-xs text-muted-foreground mt-1">Aguardando portabilidade</p>
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
            <div className="text-2xl font-bold text-secondary">R$ 450,00</div>
            <p className="text-xs text-muted-foreground mt-1 text-red-500 flex items-center gap-1">
              <Clock className="h-3 w-3" /> Vence em 5 dias
            </p>
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
            <div className="text-2xl font-bold text-secondary">{requests.length}</div>
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
                <div className="space-y-8">
                  {requests.map((req) => (
                    <div
                      key={req.id}
                      className="flex flex-col sm:flex-row justify-between gap-4 p-4 rounded-lg border bg-slate-50/50"
                    >
                      <div>
                        <h4 className="font-semibold">
                          {req.id} - {req.numbers.length}{' '}
                          {req.numbers.length === 1 ? 'número' : 'números'}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          De:{' '}
                          {req.currentOperator === 'Outra'
                            ? req.operatorOther
                            : req.currentOperator}{' '}
                          | Para: Voacell
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Localidade: {req.city} - {req.state}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Criado em: {new Date(req.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="flex flex-col items-start sm:items-end gap-2 justify-center">
                        {getStatusBadge(req.status)}
                        {req.status === 'pending' && (
                          <span className="text-xs text-amber-600 flex items-center">
                            <Clock className="h-3 w-3 mr-1" /> Em análise pelos atendentes
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
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
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-medium">
                        {new Date(inv.date).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>R$ {inv.amount.toFixed(2).replace('.', ',')}</TableCell>
                      <TableCell>
                        {inv.status === 'paid' ? (
                          <Badge className="bg-green-500">Pago</Badge>
                        ) : (
                          <Badge variant="secondary">Pendente</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-primary">
                          <Download className="h-4 w-4 mr-2" /> PDF
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
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

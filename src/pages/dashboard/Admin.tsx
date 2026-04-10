import { useState } from 'react'
import useAppStore from '@/stores/useAppStore'
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Eye, FileText, Play, CheckCircle, XCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { PortabilityRequest } from '@/types'

export default function AdminDashboard() {
  const { requests, updateRequestStatus } = useAppStore()
  const [selectedReq, setSelectedReq] = useState<PortabilityRequest | null>(null)
  const { toast } = useToast()

  const handleAction = (status: 'completed' | 'rejected') => {
    if (selectedReq) {
      updateRequestStatus(selectedReq.id, status)
      toast({
        title: 'Status Atualizado',
        description: `A solicitação foi marcada como ${status === 'completed' ? 'Aprovada' : 'Rejeitada'}.`,
        variant: status === 'rejected' ? 'destructive' : 'default',
      })
      setSelectedReq(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Aprovada</Badge>
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
            Pendente
          </Badge>
        )
      case 'rejected':
        return <Badge variant="destructive">Rejeitada</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
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
              {requests.filter((r) => r.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Aprovadas Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {requests.filter((r) => r.status === 'completed').length}
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
                <TableHead>ID</TableHead>
                <TableHead>Cliente / CNPJ</TableHead>
                <TableHead>Operadora Origem</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium text-secondary">{req.id}</TableCell>
                  <TableCell>
                    <div className="font-medium">{req.ownerName}</div>
                    <div className="text-xs text-muted-foreground">{req.document}</div>
                  </TableCell>
                  <TableCell>{req.currentOperator}</TableCell>
                  <TableCell>{new Date(req.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{getStatusBadge(req.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedReq(req)}>
                      <Eye className="h-4 w-4 mr-2" /> Analisar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
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
                  Análise de Solicitação: {selectedReq.id}
                </SheetTitle>
                <SheetDescription>
                  Verifique os dados e documentos antes de aprovar.
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6">
                {/* Data Section */}
                <div className="space-y-3">
                  <h3 className="font-semibold border-b pb-2">Dados do Cliente</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground block">Proprietário</span>
                      {selectedReq.ownerName}
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Documento</span>
                      {selectedReq.document}
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Email</span>
                      {selectedReq.email}
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Operadora Atual</span>
                      {selectedReq.currentOperator}
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground block mb-1">
                        Números a Portar ({selectedReq.numbers.length})
                      </span>
                      <div className="bg-slate-50 p-2 rounded border font-mono text-xs max-h-24 overflow-y-auto">
                        {selectedReq.numbers.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Documents Section */}
                <div className="space-y-3">
                  <h3 className="font-semibold border-b pb-2">Documentação Anexada</h3>
                  <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" size="sm" className="bg-slate-50">
                      <FileText className="h-4 w-4 mr-2 text-blue-500" /> Termo_Assinado.pdf
                    </Button>
                    <Button variant="outline" size="sm" className="bg-slate-50">
                      <FileText className="h-4 w-4 mr-2 text-blue-500" /> Fatura_Vivo.pdf
                    </Button>
                    <Button variant="outline" size="sm" className="bg-slate-50">
                      <FileText className="h-4 w-4 mr-2 text-blue-500" /> CNH_Titular.pdf
                    </Button>
                  </div>
                </div>

                {/* Video Section */}
                <div className="space-y-3">
                  <h3 className="font-semibold border-b pb-2">Validação por Vídeo</h3>
                  <div className="aspect-video bg-black rounded-lg relative flex items-center justify-center border group">
                    <img
                      src="https://img.usecurling.com/ppl/large?gender=male"
                      alt="Thumb"
                      className="w-full h-full object-cover opacity-60"
                    />
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute rounded-full h-12 w-12 bg-white/20 backdrop-blur hover:bg-white/40 text-white"
                    >
                      <Play className="h-6 w-6 ml-1" />
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                {selectedReq.status === 'pending' && (
                  <div className="pt-6 border-t flex gap-3">
                    <Button
                      className="flex-1 bg-primary hover:bg-primary/90 text-white"
                      onClick={() => handleAction('completed')}
                    >
                      <CheckCircle className="mr-2 h-5 w-5" /> Aprovar
                    </Button>
                    <Button
                      className="flex-1"
                      variant="destructive"
                      onClick={() => handleAction('rejected')}
                    >
                      <XCircle className="mr-2 h-5 w-5" /> Rejeitar
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

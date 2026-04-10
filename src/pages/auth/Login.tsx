import { useNavigate } from 'react-router-dom'
import useAppStore from '@/stores/useAppStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, ShieldAlert } from 'lucide-react'

export default function Login() {
  const { login } = useAppStore()
  const navigate = useNavigate()

  const handleLogin = (role: 'client' | 'admin') => {
    login(role)
    navigate(role === 'admin' ? '/admin' : '/cliente')
  }

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 py-12 animate-fade-in">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold text-secondary">Acesso ao Sistema</CardTitle>
          <CardDescription>
            Selecione seu perfil para entrar (Ambiente de Demonstração)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <Button
            variant="outline"
            className="w-full h-14 text-lg justify-start px-6 gap-4 hover:bg-slate-50"
            onClick={() => handleLogin('client')}
          >
            <User className="h-6 w-6 text-primary" />
            Entrar como Cliente
          </Button>
          <Button
            variant="outline"
            className="w-full h-14 text-lg justify-start px-6 gap-4 hover:bg-slate-50"
            onClick={() => handleLogin('admin')}
          >
            <ShieldAlert className="h-6 w-6 text-secondary" />
            Entrar como Administrador
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

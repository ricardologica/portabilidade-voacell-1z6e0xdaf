import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import pb from '@/lib/pocketbase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { getErrorMessage } from '@/lib/pocketbase/errors'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== passwordConfirm) {
      toast({ title: 'Erro', description: 'As senhas não coincidem.', variant: 'destructive' })
      return
    }
    setLoading(true)
    try {
      await pb.collection('users').create({
        email,
        password,
        passwordConfirm,
        name,
        role: 'client',
      })
      await pb.collection('users').authWithPassword(email, password)
      toast({ title: 'Conta criada com sucesso!' })
      navigate('/cliente')
    } catch (err: any) {
      toast({
        title: 'Erro ao criar conta',
        description: getErrorMessage(err),
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-120px)] p-4">
      <Card className="w-full max-w-md border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Criar Conta</CardTitle>
          <CardDescription>Cadastre-se na Voacell para solicitar portabilidade</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: João Silva"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Senha</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Confirmar Senha</Label>
              <Input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Criando conta...' : 'Cadastrar'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Já possui uma conta?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Entrar
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

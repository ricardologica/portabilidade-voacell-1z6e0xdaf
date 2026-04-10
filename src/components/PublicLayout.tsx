import { Link, Outlet } from 'react-router-dom'
import { Logo } from './Logo'
import { Button } from './ui/button'
import useAppStore from '@/stores/useAppStore'

export default function PublicLayout() {
  const { user, logout } = useAppStore()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/">
            <Logo />
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/portabilidade">
              <Button variant="ghost" className="hidden sm:flex text-secondary font-medium">
                Solicitar Portabilidade
              </Button>
            </Link>
            {user ? (
              <div className="flex items-center gap-2">
                <Link to={user.role === 'admin' ? '/admin' : '/cliente'}>
                  <Button variant="outline">Ir para Dashboard</Button>
                </Link>
                <Button variant="ghost" onClick={logout}>
                  Sair
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button className="bg-secondary hover:bg-secondary/90 text-white">
                  Área do Cliente
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t py-8 mt-12 bg-white">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2026 Voacell Telecom. Todos os direitos reservados.</p>
          <p className="mt-1">Plataforma em conformidade com a LGPD.</p>
        </div>
      </footer>
    </div>
  )
}

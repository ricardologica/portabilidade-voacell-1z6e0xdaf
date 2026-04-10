import { Outlet, Navigate, Link } from 'react-router-dom'
import { Bell, LayoutDashboard, FileText, Settings, LogOut, PhoneCall, Users } from 'lucide-react'
import useAppStore from '@/stores/useAppStore'
import { Logo } from './Logo'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from './ui/sidebar'

export default function DashboardLayout() {
  const { user, logout } = useAppStore()

  if (!user) return <Navigate to="/login" replace />

  const navItems =
    user.role === 'admin'
      ? [
          { title: 'Painel', url: '/admin', icon: LayoutDashboard },
          { title: 'Solicitações', url: '#', icon: FileText },
          { title: 'Clientes', url: '#', icon: Users },
          { title: 'Configurações', url: '#', icon: Settings },
        ]
      : [
          { title: 'Meu Painel', url: '/cliente', icon: LayoutDashboard },
          { title: 'Nova Portabilidade', url: '/portabilidade', icon: PhoneCall },
          { title: 'Faturas', url: '#', icon: FileText },
          { title: 'Configurações', url: '#', icon: Settings },
        ]

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50">
        <Sidebar className="border-r-0 shadow-lg">
          <SidebarHeader className="h-16 flex items-center justify-center border-b border-sidebar-border/30 px-4">
            <Link to="/">
              <Logo variant="white" />
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <Link to={item.url} className="text-sidebar-foreground/90 hover:text-white">
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-sidebar-border/30 p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground/80 hover:text-white hover:bg-sidebar-accent"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </Button>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-16 flex items-center justify-between px-6 bg-white border-b sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="font-semibold text-lg hidden sm:block text-secondary">
                {user.role === 'admin' ? 'Área Administrativa' : 'Área do Cliente'}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground hover:text-secondary"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-primary animate-pulse" />
              </Button>
              <div className="flex items-center gap-3 border-l pl-4">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <Avatar className="h-9 w-9 border">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 animate-fade-in">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Role, User, PortabilityRequest, Invoice, CallLog } from '@/types'

interface AppState {
  user: User | null
  requests: PortabilityRequest[]
  invoices: Invoice[]
  calls: CallLog[]
  login: (role: Role) => void
  logout: () => void
  addRequest: (req: Omit<PortabilityRequest, 'id' | 'createdAt' | 'status'>) => void
  updateRequestStatus: (id: string, status: PortabilityRequest['status']) => void
}

const mockRequests: PortabilityRequest[] = [
  {
    id: 'REQ-001',
    ownerName: 'Tech Mundo Telecom',
    document: '27.298.128/0001-30',
    email: 'contato@techmundo.com',
    currentOperator: 'Vivo',
    locality: 'SP (DDD 11)',
    numbers: ['11 99999-1111', '11 98888-2222'],
    documentsUploaded: true,
    videoAuthorized: true,
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
]

const mockInvoices: Invoice[] = [
  { id: 'INV-102', date: '2026-03-10', amount: 450.0, status: 'paid' },
  { id: 'INV-103', date: '2026-04-10', amount: 450.0, status: 'pending' },
]

const mockCalls: CallLog[] = [
  { id: 'C1', destination: '11 97777-3333', duration: '05:23', date: '2026-04-09 14:30' },
  { id: 'C2', destination: '21 96666-4444', duration: '12:05', date: '2026-04-08 09:15' },
]

const AppContext = createContext<AppState | undefined>(undefined)

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [requests, setRequests] = useState<PortabilityRequest[]>(mockRequests)

  const login = (role: Role) => {
    setUser({
      id: role === 'admin' ? 'A1' : 'C1',
      name: role === 'admin' ? 'Administrador' : 'João Silva',
      role,
      email: role === 'admin' ? 'admin@voacell.com' : 'joao@cliente.com',
      avatar: `https://img.usecurling.com/ppl/thumbnail?seed=${role === 'admin' ? 5 : 2}`,
    })
  }

  const logout = () => setUser(null)

  const addRequest = (req: Omit<PortabilityRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: PortabilityRequest = {
      ...req,
      id: `REQ-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0')}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    setRequests((prev) => [newReq, ...prev])
  }

  const updateRequestStatus = (id: string, status: PortabilityRequest['status']) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  return React.createElement(
    AppContext.Provider,
    {
      value: {
        user,
        requests,
        invoices: mockInvoices,
        calls: mockCalls,
        login,
        logout,
        addRequest,
        updateRequestStatus,
      },
    },
    children,
  )
}

export default function useAppStore() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppStore must be used within AppStoreProvider')
  return context
}

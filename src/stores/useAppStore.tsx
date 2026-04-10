import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Role, User } from '@/types'
import pb from '@/lib/pocketbase/client'

interface AppState {
  user: User | null
  logout: () => void
  login: (role: Role) => void // Kept for compatibility with Layouts
}

const AppContext = createContext<AppState | undefined>(undefined)

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const rec = pb.authStore.record
    if (rec) {
      return {
        id: rec.id,
        name: rec.name,
        role: rec.role as Role,
        email: rec.email,
        avatar: rec.avatar,
      }
    }
    return null
  })

  useEffect(() => {
    return pb.authStore.onChange((token, record) => {
      if (record) {
        setUser({
          id: record.id,
          name: record.name,
          role: record.role as Role,
          email: record.email,
          avatar: record.avatar,
        })
      } else {
        setUser(null)
      }
    })
  }, [])

  const logout = () => {
    pb.authStore.clear()
  }
  const login = () => {}

  return React.createElement(AppContext.Provider, { value: { user, logout, login } }, children)
}

export default function useAppStore() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppStore must be used within AppStoreProvider')
  return ctx
}

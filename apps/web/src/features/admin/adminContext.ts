import { createContext, useContext } from 'react'

export type AdminStatus = 'checking' | 'admin' | 'guest'

export type AdminContextValue = {
  status: AdminStatus
  visitorView: boolean
  setVisitorView: (value: boolean) => void
}

export const AdminContext = createContext<AdminContextValue>({
  status: 'guest',
  visitorView: false,
  setVisitorView: () => {},
})

export function useAdmin() {
  return useContext(AdminContext)
}
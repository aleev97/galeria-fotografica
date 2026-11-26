import { type ReactNode, useEffect, useState } from 'react'
import { useLocation } from 'react-router'

import { useApi } from '@/hooks/useApi'

import { AdminContext, type AdminStatus } from './adminContext'
import { HINT_KEY, readFlag, VISITOR_KEY, writeFlag } from './storage'

export function AdminProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const [visitorView, setVisitorViewState] = useState(() => readFlag(sessionStorage, VISITOR_KEY))

  // Los visitantes nunca consultan la sesión: solo se consulta si esta persona ya inició
  // sesión antes en este navegador, o si está entrando a /admin
  const shouldCheck = readFlag(localStorage, HINT_KEY) || pathname.startsWith('/admin')
  const session = useApi<{ authenticated: true }>(shouldCheck ? '/admin/me' : null)

  useEffect(() => {
    if (session.status === 'success') writeFlag(localStorage, HINT_KEY, true)
    if (session.status === 'error') writeFlag(localStorage, HINT_KEY, false)
  }, [session.status])

  const setVisitorView = (value: boolean) => {
    writeFlag(sessionStorage, VISITOR_KEY, value)
    setVisitorViewState(value)
  }

  let status: AdminStatus = 'guest'
  if (shouldCheck) {
    if (session.status === 'loading') status = 'checking'
    else if (session.status === 'success') status = 'admin'
  }

  return (
    <AdminContext.Provider value={{ status, visitorView, setVisitorView }}>
      {children}
    </AdminContext.Provider>
  )
}
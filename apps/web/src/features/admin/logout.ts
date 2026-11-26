import { HINT_KEY, readFlag, VISITOR_KEY, writeFlag } from './storage'

export async function logout(): Promise<void> {
  try {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
  } finally {
    if (readFlag(localStorage, HINT_KEY)) writeFlag(localStorage, HINT_KEY, false)
    writeFlag(sessionStorage, VISITOR_KEY, false)
    window.location.assign('/')
  }
}
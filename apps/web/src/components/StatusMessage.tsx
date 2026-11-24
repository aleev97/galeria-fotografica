import type { ReactNode } from 'react'

export function LoadingMessage() {
  return (
    <p role="status" className="py-16 text-center text-moon-300">
      Cargando…
    </p>
  )
}

export function ErrorMessage({ children }: { children?: ReactNode }) {
  return (
    <p role="alert" className="py-16 text-center text-moon-300">
      {children ?? 'No pudimos cargar esto. Probá de nuevo en un momento.'}
    </p>
  )
}
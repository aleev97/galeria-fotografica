import { useEffect, useState } from 'react'
import { ApiError, fetchJson } from '@/services/api'

export type ApiState<T> =
  | { status: 'loading' }
  | { status: 'error'; notFound: boolean }
  | { status: 'success'; data: T }

type Settled<T> = Exclude<ApiState<T>, { status: 'loading' }>

export function useApi<T>(path: string | null): ApiState<T> {
  const [result, setResult] = useState<{ path: string; state: Settled<T> } | null>(null)

  useEffect(() => {
    if (path === null) return
    const controller = new AbortController()

    fetchJson<T>(path, controller.signal)
      .then((data) => setResult({ path, state: { status: 'success', data } }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        const notFound = error instanceof ApiError && error.status === 404
        setResult({ path, state: { status: 'error', notFound } })
      })

    return () => controller.abort()
  }, [path])

  if (path === null || result?.path !== path) return { status: 'loading' }
  return result.state
}
export class ApiError extends Error {
  status: number
  code: string | undefined

  constructor(status: number, code?: string) {
    super(code ?? `API error ${status}`)
    this.status = status
    this.code = code
  }
}

async function throwIfNotOk(response: Response): Promise<void> {
  if (response.ok) return

  let code: string | undefined
  try {
    const body = (await response.json()) as { error?: unknown }
    if (typeof body.error === 'string') code = body.error
  } catch {
    // La respuesta no tenía cuerpo JSON
  }
  throw new ApiError(response.status, code)
}

export async function fetchJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`/api${path}`, { signal })
  await throwIfNotOk(response)
  return (await response.json()) as T
}

export async function sendJson<T>(
  method: 'PATCH' | 'POST',
  path: string,
  body?: unknown,
): Promise<T> {
  const response = await fetch(`/api${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  await throwIfNotOk(response)
  return (await response.json()) as T
}
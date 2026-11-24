export class ApiError extends Error {
  status: number

  constructor(status: number) {
    super(`API error ${status}`)
    this.status = status
  }
}

export async function fetchJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`/api${path}`, { signal })
  if (!response.ok) throw new ApiError(response.status)
  return (await response.json()) as T
}
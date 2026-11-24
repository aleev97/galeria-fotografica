import type { Collection, Photo, PhotoListResponse } from '@astrogaia/shared'
import { useEffect, useState } from 'react'
import { fetchJson } from '@/services/api'

export const PAGE_SIZE = 6

type Status = 'loading' | 'ready' | 'error'

export function useGallery(collection: Collection | undefined, query: string) {
  const [items, setItems] = useState<Photo[]>([])
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState<Status>('loading')
  // "attempt" permite reintentar la misma página si falló
  const [request, setRequest] = useState({ offset: 0, attempt: 0 })

  useEffect(() => {
    const controller = new AbortController()
    const params = new URLSearchParams({
      limit: String(PAGE_SIZE),
      offset: String(request.offset),
    })
    if (collection) params.set('collection', collection)
    if (query) params.set('q', query)

    fetchJson<PhotoListResponse>(`/photos?${params}`, controller.signal)
      .then((data) => {
        setItems((current) => (request.offset === 0 ? data.items : [...current, ...data.items]))
        setTotal(data.total)
        setStatus('ready')
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus('error')
      })

    return () => controller.abort()
  }, [collection, query, request])

  const loadMore = () => {
    setStatus('loading')
    setRequest((current) => ({ offset: items.length, attempt: current.attempt + 1 }))
  }

  return { items, total, status, hasMore: items.length < total, loadMore }
}
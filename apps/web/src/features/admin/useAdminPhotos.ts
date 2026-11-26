import type { AdminPhoto, UpdatePhotoInput } from '@astrogaia/shared'
import { useEffect, useState } from 'react'
import { fetchAdminPhotos, patchAdminPhoto } from '@/services/adminApi'
import { describeError } from './errors'

type Status = 'loading' | 'ready' | 'error'

export function useAdminPhotos() {
  const [items, setItems] = useState<AdminPhoto[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    fetchAdminPhotos(controller.signal)
      .then((data) => {
        setItems(data.items)
        setStatus('ready')
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus('error')
      })

    return () => controller.abort()
  }, [])

  const update = async (id: string, input: UpdatePhotoInput) => {
    setSaveError(null)
    try {
      const photo = await patchAdminPhoto(id, input)
      // La pantalla se actualiza con lo que confirmó el servidor, no con lo que supusimos
      setItems((current) => current.map((item) => (item.id === id ? photo : item)))
    } catch (error) {
      setSaveError(describeError(error))
    }
  }

  return { items, status, saveError, update }
}
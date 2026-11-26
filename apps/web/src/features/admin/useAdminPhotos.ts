import type { AdminPhoto, UpdatePhotoInput } from '@astrogaia/shared'
import { useEffect, useState } from 'react'
import { fetchAdminPhotos, moveAdminPhoto, patchAdminPhoto } from '@/services/adminApi'
import { describeError } from './errors'

type Status = 'loading' | 'ready' | 'error'

export function useAdminPhotos() {
  const [items, setItems] = useState<AdminPhoto[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [saveError, setSaveError] = useState<string | null>(null)
  // Al cambiar este número, se vuelve a pedir la lista al servidor
  const [reloadKey, setReloadKey] = useState(0)

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
  }, [reloadKey])

  const update = async (id: string, input: UpdatePhotoInput) => {
    setSaveError(null)
    try {
      const photo = await patchAdminPhoto(id, input)
      setItems((current) => current.map((item) => (item.id === id ? photo : item)))
    } catch (error) {
      setSaveError(describeError(error))
    }
  }

  const move = async (id: string, direction: 'up' | 'down') => {
    setSaveError(null)
    try {
      await moveAdminPhoto(id, direction)
      setReloadKey((current) => current + 1)
    } catch (error) {
      setSaveError(describeError(error))
    }
  }

  return { items, status, saveError, update, move }
}
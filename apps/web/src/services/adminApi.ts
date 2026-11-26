import type { AdminPhoto, AdminPhotoListResponse, AdminPhotoResponse, UpdatePhotoInput, } from '@astrogaia/shared'

import { fetchJson, sendJson } from './api'

export function fetchAdminPhotos(signal?: AbortSignal) {
  return fetchJson<AdminPhotoListResponse>('/admin/photos?limit=200', signal)
}

export async function patchAdminPhoto(id: string, input: UpdatePhotoInput): Promise<AdminPhoto> {
  const { photo } = await sendJson<AdminPhotoResponse>(
    'PATCH',
    `/admin/photos/${encodeURIComponent(id)}`,
    input,
  )
  return photo
}

export async function moveAdminPhoto(id: string, direction: 'up' | 'down'): Promise<void> {
  await sendJson<{ ok: true }>('POST', `/admin/photos/${encodeURIComponent(id)}/move`, {
    direction,
  })
}

export async function deleteAdminPhoto(id: string): Promise<void> {
  await sendJson<{ ok: true }>('DELETE', `/admin/photos/${encodeURIComponent(id)}`)
}
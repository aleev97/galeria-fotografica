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
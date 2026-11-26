import type {
  AdminPhoto,
  AdminPhotoListResponse,
  UpdatePhotoInput,
} from '@astrogaia/shared'

import {
  findAllPhotos,
  findPhotoById,
  updatePhoto,
} from '../repositories/adminPhotosRepository'
import { writeAudit } from '../repositories/adminRepository'
import type { AdminPhotoRow } from '../types/photo'
import { toPhoto } from './photosService'

const toAdminPhoto = (row: AdminPhotoRow): AdminPhoto => ({
  ...toPhoto(row),
  published: row.published === 1,
  sortOrder: row.sort_order,
  updatedAt: row.updated_at,
})

export type UpdateResult =
  | { ok: true; photo: AdminPhoto }
  | { ok: false; reason: 'not_found' | 'alt_required' }

export async function listAdminPhotos(
  db: D1Database,
  limit: number,
  offset: number,
): Promise<AdminPhotoListResponse> {
  const { rows, total } = await findAllPhotos(db, limit, offset)
  return { items: rows.map(toAdminPhoto), total, limit, offset }
}

export async function getAdminPhoto(db: D1Database, id: string): Promise<AdminPhoto | null> {
  const row = await findPhotoById(db, id)
  return row ? toAdminPhoto(row) : null
}

export async function updateAdminPhoto(
  db: D1Database,
  id: string,
  input: UpdatePhotoInput,
): Promise<UpdateResult> {
  const current = await findPhotoById(db, id)
  if (!current) return { ok: false, reason: 'not_found' }

  // Regla de accesibilidad: una foto publicada siempre tiene texto alternativo
  const willBePublished = input.published ?? current.published === 1
  const finalAlt = input.alt ?? current.alt
  if (willBePublished && finalAlt.trim() === '') return { ok: false, reason: 'alt_required' }

  await updatePhoto(db, id, input)
  // Se registra qué foto y qué campos cambiaron, nunca el contenido
  await writeAudit(db, 'photo_update', `${id}: ${Object.keys(input).join(', ')}`)

  const updated = await findPhotoById(db, id)
  return updated ? { ok: true, photo: toAdminPhoto(updated) } : { ok: false, reason: 'not_found' }
}
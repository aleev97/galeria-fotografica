import type { Photo, PhotoDetailResponse, PhotoListResponse } from '@astrogaia/shared'
import { findNeighbours, findPublished, findPublishedById, type ListParams, } from '../repositories/photosRepository'
import type { PhotoRow } from '../types/photo'

export const toPhoto = (row: PhotoRow): Photo => ({
  id: row.id,
  title: row.title,
  alt: row.alt,
  ...(row.description ? { description: row.description } : {}),
  collection: row.collection,
  width: row.width,
  height: row.height,
  featured: row.featured === 1,
})

export async function listPhotos(db: D1Database, params: ListParams): Promise<PhotoListResponse> {
  const { rows, total } = await findPublished(db, params)
  return { items: rows.map(toPhoto), total, limit: params.limit, offset: params.offset }
}

export async function getPhoto(db: D1Database, id: string): Promise<PhotoDetailResponse | null> {
  const row = await findPublishedById(db, id)
  if (!row) return null

  const { previous, next } = await findNeighbours(db, id)
  return { photo: toPhoto(row), previous, next }
}
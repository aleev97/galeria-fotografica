import { findPublished, findPublishedById, type ListParams } from '../repositories/photosRepository'
import type { Photo, PhotoRow } from '../types/photo'

const toPhoto = (row: PhotoRow): Photo => ({
  id: row.id,
  title: row.title,
  alt: row.alt,
  ...(row.description ? { description: row.description } : {}),
  collection: row.collection,
  width: row.width,
  height: row.height,
  featured: row.featured === 1,
})

export async function listPhotos(db: D1Database, params: ListParams) {
  const { rows, total } = await findPublished(db, params)
  return { items: rows.map(toPhoto), total, limit: params.limit, offset: params.offset }
}

export async function getPhoto(db: D1Database, id: string): Promise<Photo | null> {
  const row = await findPublishedById(db, id)
  return row ? toPhoto(row) : null
}
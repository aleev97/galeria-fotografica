import type { Collection } from '@astrogaia/shared'

import type { PhotoRow } from '../types/photo'

export type ListParams = {
  collection?: Collection
  query?: string
  featured?: boolean
  ids?: string[]
  limit: number
  offset: number
}

type PhotoLinkRow = { id: string; title: string }

const COLUMNS = 'id, title, alt, description, collection, width, height, featured'

// Escapa los comodines de LIKE para que el texto buscado se tome literal
const escapeLike = (value: string) => value.replace(/[\\%_]/g, '\\$&')

export async function findPublished(
  db: D1Database,
  params: ListParams,
): Promise<{ rows: PhotoRow[]; total: number }> {
  const conditions = ['published = 1']
  const values: (string | number)[] = []

  if (params.collection) {
    conditions.push('collection = ?')
    values.push(params.collection)
  }
  if (params.featured !== undefined) {
    conditions.push('featured = ?')
    values.push(params.featured ? 1 : 0)
  }
  if (params.ids) {
    // Los signos ? son fijos (uno por id); los valores se pasan siempre con bind()
    conditions.push(`id IN (${params.ids.map(() => '?').join(', ')})`)
    values.push(...params.ids)
  }
  if (params.query) {
    conditions.push("(title LIKE ? ESCAPE '\\' OR alt LIKE ? ESCAPE '\\')")
    const pattern = `%${escapeLike(params.query)}%`
    values.push(pattern, pattern)
  }

  const where = conditions.join(' AND ')

  const [list, count] = await db.batch([
    db
      .prepare(
        `SELECT ${COLUMNS} FROM photos WHERE ${where} ORDER BY sort_order, id LIMIT ? OFFSET ?`,
      )
      .bind(...values, params.limit, params.offset),
    db.prepare(`SELECT COUNT(*) AS total FROM photos WHERE ${where}`).bind(...values),
  ])

  return {
    rows: list.results as PhotoRow[],
    total: (count.results[0] as { total: number }).total,
  }
}

export async function findPublishedById(db: D1Database, id: string): Promise<PhotoRow | null> {
  return db
    .prepare(`SELECT ${COLUMNS} FROM photos WHERE id = ? AND published = 1`)
    .bind(id)
    .first<PhotoRow>()
}

export async function findNeighbours(
  db: D1Database,
  id: string,
): Promise<{ previous: PhotoLinkRow | null; next: PhotoLinkRow | null }> {
  const [previous, next] = await db.batch([
    db
      .prepare(
        'SELECT id, title FROM photos WHERE published = 1 AND sort_order < (SELECT sort_order FROM photos WHERE id = ?) ORDER BY sort_order DESC LIMIT 1',
      )
      .bind(id),
    db
      .prepare(
        'SELECT id, title FROM photos WHERE published = 1 AND sort_order > (SELECT sort_order FROM photos WHERE id = ?) ORDER BY sort_order ASC LIMIT 1',
      )
      .bind(id),
  ])

  return {
    previous: (previous.results[0] as PhotoLinkRow | undefined) ?? null,
    next: (next.results[0] as PhotoLinkRow | undefined) ?? null,
  }
}

export async function countByCollection(
  db: D1Database,
): Promise<{ collection: Collection; count: number }[]> {
  const { results } = await db
    .prepare('SELECT collection, COUNT(*) AS count FROM photos WHERE published = 1 GROUP BY collection')
    .all<{ collection: Collection; count: number }>()
  return results
}

/** La primera foto publicada de cada colección (la de menor sort_order) */
export async function findCovers(db: D1Database): Promise<PhotoRow[]> {
  const { results } = await db
    .prepare(
      `SELECT ${COLUMNS} FROM photos p WHERE published = 1 AND sort_order = (SELECT MIN(sort_order) FROM photos WHERE published = 1 AND collection = p.collection)`,
    )
    .all<PhotoRow>()
  return results
}
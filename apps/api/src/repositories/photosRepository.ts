import type { Collection, PhotoRow } from '../types/photo'

export type ListParams = {
  collection?: Collection
  query?: string
  featured?: boolean
  limit: number
  offset: number
}

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
  if (params.query) {
    conditions.push("(title LIKE ? ESCAPE '\\' OR alt LIKE ? ESCAPE '\\')")
    const pattern = `%${escapeLike(params.query)}%`
    values.push(pattern, pattern)
  }

  // Solo se concatenan fragmentos fijos de SQL; los valores del usuario van siempre con bind()
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

export async function countByCollection(
  db: D1Database,
): Promise<{ collection: Collection; count: number }[]> {
  const { results } = await db
    .prepare('SELECT collection, COUNT(*) AS count FROM photos WHERE published = 1 GROUP BY collection')
    .all<{ collection: Collection; count: number }>()
  return results
}
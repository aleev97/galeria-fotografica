import type { AdminPhotoRow } from '../types/photo'

const ADMIN_COLUMNS =
  'id, title, alt, description, collection, width, height, featured, published, sort_order, updated_at'

export type PhotoChanges = {
  title?: string
  alt?: string
  description?: string | null
  collection?: string
  featured?: boolean
  published?: boolean
}

export async function findAllPhotos(
  db: D1Database,
  limit: number,
  offset: number,
): Promise<{ rows: AdminPhotoRow[]; total: number }> {
  const [list, count] = await db.batch([
    db
      .prepare(`SELECT ${ADMIN_COLUMNS} FROM photos ORDER BY sort_order, id LIMIT ? OFFSET ?`)
      .bind(limit, offset),
    db.prepare('SELECT COUNT(*) AS total FROM photos'),
  ])

  return {
    rows: list.results as AdminPhotoRow[],
    total: (count.results[0] as { total: number }).total,
  }
}

export async function findPhotoById(db: D1Database, id: string): Promise<AdminPhotoRow | null> {
  return db
    .prepare(`SELECT ${ADMIN_COLUMNS} FROM photos WHERE id = ?`)
    .bind(id)
    .first<AdminPhotoRow>()
}

export async function updatePhoto(
  db: D1Database,
  id: string,
  changes: PhotoChanges,
): Promise<void> {
  const sets: string[] = []
  const values: (string | number | null)[] = []

  if (changes.title !== undefined) {
    sets.push('title = ?')
    values.push(changes.title)
  }
  if (changes.alt !== undefined) {
    sets.push('alt = ?')
    values.push(changes.alt)
  }
  if (changes.description !== undefined) {
    sets.push('description = ?')
    values.push(changes.description)
  }
  if (changes.collection !== undefined) {
    sets.push('collection = ?')
    values.push(changes.collection)
  }
  if (changes.featured !== undefined) {
    sets.push('featured = ?')
    values.push(changes.featured ? 1 : 0)
  }
  if (changes.published !== undefined) {
    sets.push('published = ?')
    values.push(changes.published ? 1 : 0)
  }

  if (sets.length === 0) return

  await db
    .prepare(`UPDATE photos SET ${sets.join(', ')}, updated_at = datetime('now') WHERE id = ?`)
    .bind(...values, id)
    .run()
}

export type MoveOutcome = 'moved' | 'edge' | 'not_found'

/** Intercambia el orden de una foto con su vecina inmediata */
export async function swapWithNeighbour(
  db: D1Database,
  id: string,
  direction: 'up' | 'down',
): Promise<MoveOutcome> {
  const current = await db
    .prepare('SELECT id, sort_order FROM photos WHERE id = ?')
    .bind(id)
    .first<{ id: string; sort_order: number }>()
  if (!current) return 'not_found'

  const neighbourSql =
    direction === 'up'
      ? 'SELECT id, sort_order FROM photos WHERE sort_order < ? ORDER BY sort_order DESC LIMIT 1'
      : 'SELECT id, sort_order FROM photos WHERE sort_order > ? ORDER BY sort_order ASC LIMIT 1'

  const neighbour = await db
    .prepare(neighbourSql)
    .bind(current.sort_order)
    .first<{ id: string; sort_order: number }>()
  if (!neighbour) return 'edge'

  // Las dos actualizaciones se ejecutan juntas: o se hacen las dos o ninguna
  await db.batch([
    db
      .prepare("UPDATE photos SET sort_order = ?, updated_at = datetime('now') WHERE id = ?")
      .bind(neighbour.sort_order, current.id),
    db
      .prepare("UPDATE photos SET sort_order = ?, updated_at = datetime('now') WHERE id = ?")
      .bind(current.sort_order, neighbour.id),
  ])
  return 'moved'
}

export async function deletePhoto(db: D1Database, id: string): Promise<void> {
  await db.prepare('DELETE FROM photos WHERE id = ?').bind(id).run()
}
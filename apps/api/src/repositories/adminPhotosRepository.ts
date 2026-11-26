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
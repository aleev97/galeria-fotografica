import { COLLECTIONS } from '../config/constants'
import { countByCollection } from '../repositories/photosRepository'

export async function listCollections(db: D1Database) {
  const counts = await countByCollection(db)
  return COLLECTIONS.map((id) => ({
    id,
    count: counts.find((row) => row.collection === id)?.count ?? 0,
  }))
}
import { COLLECTIONS, type CollectionSummary } from '@astrogaia/shared'
import { countByCollection, findCovers } from '../repositories/photosRepository'
import { toPhoto } from './photosService'

export async function listCollections(db: D1Database): Promise<CollectionSummary[]> {
  const [counts, covers] = await Promise.all([countByCollection(db), findCovers(db)])

  return COLLECTIONS.map((id) => {
    const cover = covers.find((row) => row.collection === id)
    return {
      id,
      count: counts.find((row) => row.collection === id)?.count ?? 0,
      cover: cover ? toPhoto(cover) : null,
    }
  })
}
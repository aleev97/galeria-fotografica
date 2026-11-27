import { COLLECTIONS, type CollectionSummary } from '@astrogaia/shared'

import { countByCollection, findCovers } from '../repositories/photosRepository'
import { toPhoto } from './photosService'

// Memoria de corta duración: evita consultar la base en cada visita al Home.
// Si el administrador cambia algo, se refleja en menos de 30 segundos.
const TTL_MS = 30_000
let cache: { at: number; data: CollectionSummary[] } | null = null

export async function listCollections(db: D1Database): Promise<CollectionSummary[]> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.data

  const [counts, covers] = await Promise.all([countByCollection(db), findCovers(db)])

  const data = COLLECTIONS.map((id) => {
    const cover = covers.find((row) => row.collection === id)
    return {
      id,
      count: counts.find((row) => row.collection === id)?.count ?? 0,
      cover: cover ? toPhoto(cover) : null,
    }
  })

  cache = { at: Date.now(), data }
  return data
}
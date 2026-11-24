export const COLLECTIONS = ['cosmos', 'earth', 'wildlife', 'details'] as const

export type Collection = (typeof COLLECTIONS)[number]

export type Photo = {
  id: string
  title: string
  alt: string
  description?: string
  collection: Collection
  width: number
  height: number
  featured: boolean
}

/** Referencia mínima a otra foto (para anterior / siguiente) */
export type PhotoLink = {
  id: string
  title: string
}

export type PhotoListResponse = {
  items: Photo[]
  total: number
  limit: number
  offset: number
}

export type PhotoDetailResponse = {
  photo: Photo
  previous: PhotoLink | null
  next: PhotoLink | null
}

export type CollectionSummary = {
  id: Collection
  count: number
  cover: Photo | null
}

export type CollectionListResponse = {
  items: CollectionSummary[]
}
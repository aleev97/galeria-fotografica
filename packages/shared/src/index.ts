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

/** Foto tal como la ve el administrador (incluye borradores) */
export type AdminPhoto = Photo & {
  published: boolean
  sortOrder: number
  updatedAt: string
}

export type AdminPhotoListResponse = {
  items: AdminPhoto[]
  total: number
  limit: number
  offset: number
}

export type AdminPhotoResponse = {
  photo: AdminPhoto
}

export type UpdatePhotoInput = {
  title?: string
  alt?: string
  description?: string | null
  collection?: Collection
  featured?: boolean
  published?: boolean
}
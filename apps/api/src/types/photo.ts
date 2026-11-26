import type { Collection } from '@astrogaia/shared'

/** Fila tal como viene de la base de datos */
export type PhotoRow = {
  id: string
  title: string
  alt: string
  description: string | null
  collection: Collection
  width: number
  height: number
  featured: number
}

export type AdminPhotoRow = PhotoRow & {
  published: number
  sort_order: number
  updated_at: string
}
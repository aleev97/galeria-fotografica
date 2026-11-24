import type { COLLECTIONS } from '../config/constants'

export type Collection = (typeof COLLECTIONS)[number]

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

/** Forma pública que devuelve la API (igual a la del frontend) */
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
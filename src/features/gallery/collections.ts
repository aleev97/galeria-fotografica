import type { Collection } from '@/types/photo'

export const collections: { id: Collection; name: string; description: string }[] = [
  { id: 'cosmos', name: 'COSMOS', description: 'La Luna, las estrellas y el cielo nocturno.' },
  { id: 'earth', name: 'TIERRA', description: 'Paisajes y cielos abiertos.' },
  { id: 'wildlife', name: 'VIDA', description: 'Animales en su entorno natural.' },
  { id: 'details', name: 'DETALLES', description: 'Texturas y pequeños mundos.' },
]

export function isCollection(value: string | null): value is Collection {
  return collections.some((collection) => collection.id === value)
}
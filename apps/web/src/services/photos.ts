import { samplePhotos } from '@/data/samplePhotos'
import type { Collection, Photo } from '@/types/photo'
import { normalizeText } from '@/utils/text'

export type PhotoFilters = {
  collection?: Collection
  query?: string
}

export function getPhotos({ collection, query }: PhotoFilters = {}): Photo[] {
  const needle = query ? normalizeText(query) : ''

  return samplePhotos.filter((photo) => {
    if (collection && photo.collection !== collection) return false
    if (!needle) return true
    return normalizeText(`${photo.title} ${photo.alt}`).includes(needle)
  })
}

export function getFeaturedPhotos(): Photo[] {
  return samplePhotos.filter((photo) => photo.featured)
}

export function getPhotosByCollection(collection: Collection): Photo[] {
  return getPhotos({ collection })
}

export function getPhotoById(id: string): Photo | undefined {
  return samplePhotos.find((photo) => photo.id === id)
}

export function getAdjacentPhotos(id: string): { previous?: Photo; next?: Photo } {
  const index = samplePhotos.findIndex((photo) => photo.id === id)
  if (index === -1) return {}
  return { previous: samplePhotos[index - 1], next: samplePhotos[index + 1] }
}

export function getPhotosByIds(ids: string[]): Photo[] {
  return ids
    .map((id) => getPhotoById(id))
    .filter((photo): photo is Photo => photo !== undefined)
}
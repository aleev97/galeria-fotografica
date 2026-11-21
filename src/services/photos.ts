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
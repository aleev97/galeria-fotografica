import { samplePhotos } from '@/data/samplePhotos'
import type { Collection, Photo } from '@/types/photo'

export function getFeaturedPhotos(): Photo[] {
  return samplePhotos.filter((photo) => photo.featured)
}

export function getPhotosByCollection(collection: Collection): Photo[] {
  return samplePhotos.filter((photo) => photo.collection === collection)
}
import { CollectionsGrid } from '@/features/home/CollectionsGrid'
import { FeaturedPhotos } from '@/features/home/FeaturedPhotos'
import { Hero } from '@/features/home/Hero'

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedPhotos />
      <CollectionsGrid />
    </>
  )
}